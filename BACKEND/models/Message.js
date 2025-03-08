// Mongoose model, JavaScript class that represents a MongoDB collection in the database
// will allow us to interact with MongoDB through (these) JavaScript objects instead of raw database queries

import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    message: { type: String, required: true },  // ✅ Ensure this field is `message`, NOT `content`
    encryptedMsg: { type: String, default: "" },
    ciphertextKem: { type: String, default: "" },
    signature: { type: String, default: "" },
    timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("Message", MessageSchema);
