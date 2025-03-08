// Mongoose model, JavaScript class that represents a MongoDB collection in the database
// will allow us to interact with MongoDB through (these) JavaScript objects instead of raw database queries

import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

// Check if the model already exists
const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema);

export default Message;
