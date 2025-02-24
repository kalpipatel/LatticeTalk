
import { connectToDatabase } from "./lib/mongodb.js"; 
import express from 'express';
import { Server } from 'socket.io'
import cors from 'cors'
import Message from "./models/Message.js"
import Chat from "./models/Chat.js"
import { createServer } from "http";
import dotenv from 'dotenv';
import mongoose from 'mongoose';

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
            message, 
            encryption: {
                encrypted: true,
                algorithm: "Kyber",
            },
            delivered: onlineUsers[receiverId] ? true : false, // Mark delivered only if user is online
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


// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`WebSocket server running on port ${PORT}`));