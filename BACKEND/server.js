import { connectToDatabase } from "./lib/mongodb.js";
import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import Message from "./models/Message.js";
import Chat from "./models/Chat.js";
import { createServer } from "http";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

// Connect to database
(async () => {
    try {
        await connectToDatabase();
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Could not connect to MongoDB:", error);
        process.exit(1);
    }
})();

const app = express();
const server = createServer(app);

// Enable CORS
app.use(cors({ origin: "http://localhost:3000", methods: ["GET", "POST"] }));

// Initialize WebSocket Server
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

// Store online users
const onlineUsers = {};

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Register user
    socket.on("register", async (userId) => {
        if (!userId) {
            console.warn("Register event missing userId");
            return;
        }
        onlineUsers[userId] = socket.id;
        console.log(`User ${userId} registered with socket ID: ${socket.id}`);

        try {
            const unreadMessages = await Message.find({ receiver: userId, delivered: false });
            for (const msg of unreadMessages) {
                io.to(socket.id).emit("receiveMessage", msg);
                await Message.findByIdAndUpdate(msg._id, { delivered: true });
            }
        } catch (error) {
            console.error("Error fetching unread messages:", error);
        }
    });

    // Join a chat room
    socket.on("joinChat", (chatId) => {
        if (!chatId || !mongoose.Types.ObjectId.isValid(chatId)) {
            console.warn("Invalid chat ID:", chatId);
            return;
        }
        socket.join(chatId);
        console.log(`User ${socket.id} joined chat room: ${chatId}`);
    });

    // Handle sending a message
    socket.on("sendMessage", async (data) => {
        console.log("DEBUG: Received sendMessage event with data:", data);
    
        if (!data.message || data.message.trim() === "") {
            console.warn("Empty message detected! Aborting.");
            return;
        }
    
        try {
            const newMessage = new Message({
                sender: data.senderId,
                receiver: data.receiverId,
                message: data.message,
                encryptedMsg: data.encryptedMsg,
                ciphertextKem: data.ciphertextKem,
                signature: data.signature,
                timestamp: new Date(),
            });
    
            await newMessage.save();
            io.to(data.chatId).emit("receiveMessage", newMessage);
            console.log("Message sent successfully!", newMessage);
        } catch (error) {
            console.error("Error saving message:", error);
        }
    });
    

    // Handle user disconnection
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        
        const userId = Object.keys(onlineUsers).find(key => onlineUsers[key] === socket.id);
        if (userId) {
            delete onlineUsers[userId];
            console.log(`User ${userId} removed from online users`);
        }
    });
});

// API route to fetch messages for a chat
app.get("/messages/:chatId", async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.chatId)) {
            return res.status(400).json({ error: "Invalid chat ID" });
        }

        const messages = await Message.find({ chatId: req.params.chatId }).sort({ timestamp: 1 });
        res.json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Failed to fetch messages" });
    }
})

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`WebSocket server running on port ${PORT}`));
