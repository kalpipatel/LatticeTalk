import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Sender of the message
  content: { type: String, required: true }, // Message content
  timestamp: { type: Date, default: Date.now }, // Timestamp of when the message was sent
});

const ChatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users in chat
  messages: [MessageSchema], // Store messages in order with sender and timestamp
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" }, // Last message in chat
  User1KyberPub: { type: String }, // User1's Kyber public key
  User2KyberPub: { type: String }, // User2's Kyber public key
  User1SignPub: { type: String }, // User1's DSA public key
  User2SignPub: { type: String }, // User2's DSA public key
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Chat || mongoose.model("Chat", ChatSchema);