// Mongoose model, JavaScript class that represents a MongoDB collection in the database
// will allow us to interact with MongoDB through (these) JavaScript objects instead of raw database queries

import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    ciphertextKem: { type: String, required: true }, // Kyber key
    encryptedMsg: { type: String, required: true }, // AES text
    signature: { type: String, required: true }, // Dilithium signature
});

export default mongoose.models.Message || mongoose.model("Message", MessageSchema);