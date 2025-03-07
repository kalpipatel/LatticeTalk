import { connectToDatabase } from "../../../../BACKEND/lib/mongodb";
import Chat from "../../../../BACKEND/models/Chat";
import User from "../../../../BACKEND/models/User";
import { NextResponse } from "next/server";

// returns the chat between two users
export default async function POST(req) {
    await connectToDatabase();

    try {
        const { user1, user2 } = await req.json();

        if (!user1 || !user2) {  // Changed senderId/receiverId to user1/user2
            return NextResponse.json({ error: "Sender and receiver IDs are required" }, { status: 400 });
        }

        const sender = await User.findById(user1);
        const receiver = await User.findById(user2);
        if (!sender || !receiver) {
            return NextResponse.json({ error: "Sender or receiver not found" }, { status: 400 });
        }

        // checks if chat already exists
        let chat = await Chat.findOne({ user1: sender, user2: receiver }) || await Chat.findOne({ user1: receiver, user2: sender });

        // creates new chat if doesn't exist
        if (!chat) {
            chat = new Chat({
                id: Math.floor(Math.random() * 1000000),
                user1: sender,
                user2: receiver,
                lastMessage: null,
                messages: [],
                updatedAt: new Date()
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
export async function GET(req) {
    await connectToDatabase();

    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId"); //actually username

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        // Find all chats where the user is a participant
        const chats = await Chat.find({ $or: [{ user1: userId }, { user2: userId }] });

        return NextResponse.json({ chats });

    } catch (error) {
        console.error("GET /api/chat Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
