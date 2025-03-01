// this file defines the API routes for handling messages 
// POST for storing a new message in the database
// GET to get messages from the database
import { connectToDatabase } from "../../../../BACKEND/lib/mongodb";
import Message from "../../../../BACKEND/models/Message";
import { NextResponse } from "next/server";
import mongoose from "mongoose";


export async function POST(req) {
  await connectToDatabase();  // ensures db is connected
  try {
    const body = await req.json();
    console.log("Received request body:", body); // for debugging

    if (!body.message) {
      throw new Error("Please enter a message.");
    }

    const { sender, receiver, message } = body;

    const newMessage = new Message({ sender, receiver, message });

    // saves message to db
    await newMessage.save();
    console.log("Message saved successfully:", newMessage);

    console.log(mongoose.connection.name); // prints the connected database name, debugging


    return NextResponse.json({ message: "Message sent", data: newMessage });


  } catch (error) {
    console.error("Post /api/messages Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  await connectToDatabase();
  try {
    const messages = await Message.find();
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
