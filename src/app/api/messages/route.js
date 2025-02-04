import { connectToDatabase } from "@/backend/lib/mongodb";
import Message from "@/backend/models/Message";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectToDatabase();
  try {
    const { sender, receiver, message } = await req.json();
    
    const newMessage = new Message({ sender, receiver, message });
    await newMessage.save();

    return NextResponse.json({ message: "Message sent", data: newMessage });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  await connectToDatabase();
  const messages = await Message.find();
  return NextResponse.json(messages);
}
