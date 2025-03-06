
import { connectToDatabase } from "./lib/mongodb.js";
import express from 'express';
import { Server } from 'socket.io'
import cors from 'cors'
import File from "./models/Files.js"
import Message from "./models/Message.js"
import Chat from "./models/Chat.js"
import { createServer } from "http";
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import multer from 'multer';
import { transcribeAudio } from './transcribe.js';
import {encryptMessage} from './encryption.js';

dotenv.config();

// connecting to database
(async () => {
    try {
        await connectToDatabase();
        console.log("Connected to MongoDB successfully")
    } catch (error) {
        console.error("Could not connect to MongoDB", error);
    }
})();


const app = express();
const server = createServer(app);

// enables CORS for WebSocket connections
app.use(cors({ origin: "http://localhost:3000", methods: ["GET", "POST"] }));

app.use(express.json()); // Parses JSON requests
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded requests


// Multer configuration to ensure correct file extension
const storage = multer.diskStorage({ // Save file to disk for text-to-speech
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}.webm`);
    }
});

// Multer configuration for Speech-to-Text
const upload = multer({ storage });

const storage2 = multer.memoryStorage(); // Save file to memory for file sharing
const upload2 = multer({ storage2 });

// Initialize WebSocket Server
// creates an HTTP server, sets up CORS, creates a WebSocket server
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Allow frontend to connect
        methods: ["GET", "POST"]
    }
});

// tracks online users
// creates an onlineUsers dictionary that trakcs which userId is linked to which socket.id (so we know where to send messages)
// when a user joins, they send a "register" event with their userId
const onlineUsers = {}; 

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // registers user connection
    socket.on("register", async (userId) => {
        onlineUsers[userId] = socket.id;
        console.log(`User ${userId} registered`)

        // fetches and sends unread messages

        const unreadMessages = await Message.find({ reciever: userId, delivered: false})

        unreadMessages.forEach(async (msg) => {
            io.to(socket.id).emit("receiveMessage", msg);
            await Message.findByIdAndUpdate(msg._id, { delivered: true });
        });
    });

     // Handle incoming messages
 socket.on("sendMessage", async ({ chatId, senderId, receiverId, message }) => {
    try {
        // Ensure chatId exists
        if (!mongoose.Types.ObjectId.isValid(chatId)) {
            console.error("Invalid chat ID:", chatId);
            return;
        }

        // Save the message in MongoDB
        const newMessage = new Message({
            chatId,
            sender: senderId,
            receiver: receiverId,
            encryptedMsg,
            ciphertextKem,
            signature, 
            /*
            encryption: {
                encrypted: true,
                algorithm: "Kyber",
            },
            */
            delivered: onlineUsers[receiverId] ? true : false, // Mark delivered only if user is online
            // ^ add to Message schema?
        });

        await newMessage.save();

        // Update the chat's last message
        await Chat.findByIdAndUpdate(chatId, { lastMessage: message });

        // If the recipient is online, send the message immediately
        const recipientSocket = onlineUsers[receiverId];
        if (recipientSocket) {
            io.to(recipientSocket).emit("receiveMessage", newMessage);
        }
    } catch (error) {
        console.error("Error sending message:", error);
    }
});

// Handle disconnection
socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    
    // Remove user from tracking
    for (const userId in onlineUsers) {
        if (onlineUsers[userId] === socket.id) {
            delete onlineUsers[userId];
        }
    }
});


})

// fetches the messages
app.get("/messages/:chatId", async (req, res) => {
    try {
        const messages = await Message.find({ chatId: req.params.chatId }).sort({ timestamp: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch messages" });
    }
});


//COMMEENT CODEE OUT SO THAT YOU HAVEE NOO ISSUES MAKING THE API CALLS

// app.post("/transcribe", upload.single("audio_file"), async (req, res) => {
//     if (!req.file) { //error handling
//         return res.status(400).json({ error: "No audio file uploaded!" });
//     }
//     // Get the file path of the uploaded audio
//     const filePath = req.file.path;

//     try {
//         const transcription = await transcribeAudio(filePath);// Transcribe the audio file by calling the transcribeAudio function
//         console.log("Transcription:", transcription);
//         res.json({ transcription}); // Send the transcription back to the client in JSON format
//     } catch (error) {
//         console.error("Error transcribing audio:", error);
//         res.status(500).json({ error: "Speech recognition failed"});
//     }
// });

//test api call
app.get("/hello", (req, res) => {
    res.send("Hello World");
});

// app.post("/upload", upload2.single("file"), async (req, res) => {
//     try {
//         console.log("Received request body:", req.body);
//         console.log("Received file:", req.file);

//         const { sender, receiver } = req.body;

//         if (!sender || !receiver || !req.file) { //error handling
//             return res.status(400).json({ error: "Missing required fields (sender, receiver, file)" });
//         }

//         const newFile = new File({
//             sender,
//             receiver,
//             filename: req.file.originalname,
//             filetype: req.file.mimetype,
//             size: req.file.size,
//             file: req.file.buffer // Save the file buffer in MongoDB by converting it to a binary buffer 
//         });

//         const savedFile = await newFile.save();// Save the file in MongoDB as binary data

//         res.status(201).json({ message: "File uploaded successfully", data: savedFile });

//     } catch (error) {
//         console.error("Error uploading file:", error);
//         res.status(500).json({ error: "File upload failed" });
//     }
// });

app.post("/upload", upload2.single("file"), async (req, res) => {
    try {
        console.log("Received request body:", req.body);
        console.log("Received file:", req.file);

        const { sender, receiver, kyberPub} = req.body;

        if (!sender || !receiver || !req.file || !kyberPub) { //error handling
            return res.status(400).json({ error: "Missing required fields (sender, receiver, file)" });
        }

        const encryptedFile = encryptMessage(kyberPub, req.file.buffer.toString("base64"));
        const { ciphertextKem, encryptedMessage, encSharedSecret } = encryptedFile;

        const newFile = new File({
            sender,
            receiver,
            filename: req.file.originalname,
            filetype: req.file.mimetype,
            size: req.file.size,
            ciphertextKem,
            file: encryptedMessage, // Save the encrypted file in MongoDB
            encSharedSecret
        });

        const savedFile = await newFile.save();// Save the file in MongoDB as binary data

        res.status(201).json({ message: "File uploaded successfully", data: savedFile });

    } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).json({ error: "File upload failed" });
    }
});

app.get("/download/:fileId", async (req, res) => {
    try {
        const { fileId } = req.params;

        // Find the file in MongoDB by its ID
        const file = await File.findById(fileId); // Find the file in MongoDB by its object ID

        if (!file) { //error handling
            return res.status(404).json({ error: "File not found" });
        }

        // Set headers to trigger a file download in the browser
        //requirement of the browser to download the file
        res.set({
            "Content-Type": file.filetype,
            "Content-Disposition": `attachment; filename="${file.filename}"`,
            "Content-Length": file.size
        });

        // Send file buffer as response
        res.send(file.file);
    } catch (error) {
        console.error("Error downloading file:", error);
        res.status(500).json({ error: "File download failed" });
    }
});


// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`WebSocket server running on port ${PORT}`));