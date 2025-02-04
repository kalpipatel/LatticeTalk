// Mongoose model, JavaScript class that represents a MongoDB collection in the database
// will allow us to interact with MongoDB through (these) JavaScript objects instead of raw database queries

import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    encrypted: { type: Boolean, default: true },  // do we need this? + change 
});

export default mongoose.models.Message || mongoose.model("Message", MessageSchema);