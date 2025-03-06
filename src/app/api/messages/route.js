// this file defines the API routes for handling messages 
// POST for storing a new message in the database
// GET to get messages from the database
import { connectToDatabase } from "../../../../BACKEND/lib/mongodb";
import User from "../../../../BACKEND/models/User";
import Message from "../../../../BACKEND/models/Message";
import { NextResponse } from "next/server";


export async function POST(req) {
  await connectToDatabase();  // ensures db is connected

  try {
    const { senderId, receiverId, message } = await req.json();

    if (!senderId || !receiverId || !message) {
      return NextResponse.json({error: "missing something"}, {status: 400});
    }

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    // finds the sender/receiver in the database
    if (!sender || !receiver) {
      return NextResponse.kson({ error: "Sender or receiver not found"}, {status: 400});
    }

    // creates a new message
    const newMessage = new Message({
      sender: sender._id,
      receiver: receiver._id,
      message: message.trim(),
    });

    // saves message to db
    await newMessage.save();
    console.log("Message saved successfully:", newMessage);

    return NextResponse.json({ message: "Message sent", data: newMessage });


  } catch (error) {
    console.error("Post /api/messages Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  await connectToDatabase();

  const { searchParams } = new URL(req.url);
  const sender = searchParams.get("sender");
  const receiver = searchParams.get("receiver");
  
  try {
    const messages = await Message.find();
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
