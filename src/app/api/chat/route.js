import { connectToDatabase } from "../../../../BACKEND/lib/mongodb";
import ChatSchema from "../../models/Chat";
import User from "../../../../BACKEDN/models/User";
import { NextResponse } from "next/server";

// returns the chat between two users
export default async function POST(req) {
    await connectToDatabase();

    try {
        const { senderId, receiverId, user1Keys, user2Keys } = await req.json();

        if (!senderId || !receiverId) {
            return NextResponse.json({ error: "Sender and receiver IDs are required" }, { status: 400 });
        }

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);
    if (!sender || !receiver) {
      return NextResponse.json({ error: "Sender or receiver not found" }, { status: 400 });
    }
     
    // checks if chat already exists
    let chat = await Chat.findOne({ participants: { $all: [senderId, receiverId] } });

    // creates new chat if doesn't exist
    if (!chat) {
        chat = new Chat({
          participants: [senderId, receiverId],
          messages: [],
          User1KyberPub: user1Keys.kyber,
          User2KyberPub: user2Keys.kyber,
          User1SignPub: user1Keys.sign,
          User2SignPub: user2Keys.sign,
        });
  
        await chat.save();
      }

    return NextResponse.json({ message: "Chat retrieved/created", chat });

    } catch (error) {
        console.error("POST /api/chat Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
}

// gets all the chats for a particular user (use to load chats?)
// use this in the sidebar?
export async function GET(req) {
    await connectToDatabase();
  
    try {
      const { searchParams } = new URL(req.url);
      const userId = searchParams.get("userId");
  
      if (!userId) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
      }
  
      // Find all chats where the user is a participant
      const chats = await Chat.find({ participants: userId }).populate("participants").populate("lastMessage");
  
      return NextResponse.json({ chats });
  
    } catch (error) {
      console.error("GET /api/chat Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }