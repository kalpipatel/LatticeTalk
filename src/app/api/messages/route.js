// this file defines the API routes for handling messages 
// POST for storing a new message in the database
// GET to get messages from the database
import { connectToDatabase } from "../../../../BACKEND/lib/mongodb";
import User from "../../../../BACKEND/models/User";
import { NextResponse } from "next/server";
import Chat from "../../../../BACKEND/models/Chat";

// const [senderId, setSenderId] = useState('67c8ed1e13327778cdb114a1');
// const [receiverId, setReceiverId] = useState('67c8eddcfa3b840f1c62ad4f');


export async function POST(req) {


  await connectToDatabase();  // ensures db is connected


 
  try {
    const { senderUsername, receiverUsername, message } = await req.json();


    if (!senderUsername || !receiverUsername || !message) {
      return NextResponse.json({error: "missing something"}, {status: 400});
    }

    const sender = await User.findOne({ username: senderUsername });
    const receiver = await User.findOne({ username: receiverUsername });



    // finds the sender/receiver in the database
    if (!sender || !receiver) {
      return NextResponse.json({ error: "Sender or receiver not found"}, {status: 400});
    }



    let chat = await Chat.findOne({participants: { $all: [senderUsername, receiverUsername] } });

    if (!chat) {

      chat = new Chat({
        participants: [senderUsername, receiverUsername],
        messages: [],
        // // edit the keys
        // User1KyberPub: 1,
        // User2KyberPub: 2,
        // User1SignPub: 3,
        // User2SignPub: 4,
      });

      await chat.save();
      //return NextResponse.json({error: "Chat does not exist" }, { status: 400});
    }

  
    // creates a new message
    const newMessage = {
      sender: sender.username,
      receiver: receiver.username,
      content: message.trim(),
      timestamp: new Date(),
    };


    console.log("Before pushing the new message:", chat.messages); // Print current messages array

    console.log("New message being added:", newMessage); // Print the new message object


    chat.messages.push(newMessage);

    console.log("After pushing the new message:", chat.messages); // Print the updated messages array



    // saves message to db
    try {
      await chat.save();
    } catch (error) {
      console.error("error saving chat:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });

    }

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
  const senderUsername = searchParams.get("sender");
  const receiverUsername = searchParams.get("receiver");

  if (!senderUsername || !receiverUsername) {
    return NextResponse.json({ error: "Missing sender or receiver name"})
  }

  try {
    const chat = await Chat.findOne({ participants: { $all: [senderUsername, receiverUsername]}});

    if (!chat) {
      return NextResponse.json({error: "chat not found"}, {status: 404});
    }

    return NextResponse.json({data: chat.messages});
  } catch (error) {
    console.error("Error in GET /api/messages", error);
    return NextResponse.json({ error: error.message}, {status: 500})
  }
}
