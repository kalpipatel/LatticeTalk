import { connectToDatabase } from "../../../../BACKEND/lib/mongodb";
import User from "../../../../BACKEND/models/User";
import Chat from "../../../../BACKEND/models/Chat";
import { NextResponse } from "next/server";

// returns the chat between two users
export async function POST(req) {
    await connectToDatabase();

    try {
        const { senderUsername, receiverUsername, senderKyberPub, senderSignPub, receiverKyberPub, receiverSignPub } = await req.json();

        if (!senderUsername || !receiverUsername) {
            return NextResponse.json({ error: "Sender and receiver usernames are required" }, { status: 400 });
        }
      
    //find sender using username
    const sender = await User.findOne({ username: senderUsername });
    const receiver = await User.findOne({ username: receiverUsername });
    if (!sender || !receiver) {
      return NextResponse.json({ error: "Sender or receiver not found" }, { status: 400 });
    }
     
    // checks if chat already exists
    let chat = await Chat.findOne({ participants: { $all: [senderUsername, receiverUsername] } });

    // creates new chat if doesn't exist
    if (!chat) {
        chat = new Chat({
          participants: [senderUsername, receiverUsername],
          messages: [],
          User1KyberPub: senderKyberPub,
          User2KyberPub: receiverKyberPub,
          User1SignPub: senderSignPub,
          User2SignPub: receiverSignPub,
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
      const username = searchParams.get("username");
  
      if (!username) {
        return NextResponse.json({ error: "Usernames required" }, { status: 400 });
      }
  
      // Find all chats where the user is a participant
      const chats = await Chat.find({ participants: username })
      .populate("participants")
      .populate("lastMessage");

      return NextResponse.json({ chats });
  
    } catch (error) {
      console.error("GET /api/chat Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }