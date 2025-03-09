// this file defines the API routes for handling messages 
// POST for storing a new message in the database
// GET to get messages from the database
import { connectToDatabase } from "../../../../BACKEND/lib/mongodb";
import User from "../../../../BACKEND/models/User";
import { NextResponse } from "next/server";
import Chat from "../../../../BACKEND/models/Chat";
import Message from "../../../../BACKEND/models/Chat";
import { encryptMessage, signMessage } from "@/../BACKEND/encryption";
import { decryptMessage, verifySignature } from "@/../BACKEND/encryption";

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
        User1KyberPub: sender.kyberPub,
        User2KyberPub: receiver.kyberPub,
        User1SignPub: sender.signPub,
        User2SignPub: receiver.signPriv,
      });

      await chat.save();
      //return NextResponse.json({error: "Chat does not exist" }, { status: 400});
    }

    //----ENCRYPTION----
    // generate ciphertext, encryptedmessage, encsharedsecret before storing
    // have to convert keys back to Uint8 array to use methods
    const userStringKey = receiver.kyberPub; // encapsulating using receiver's public key
    const userStringSign = sender.signPriv; // sign using sender's priv key 


    const kyberPubArray = Array.from(new Uint8Array(Buffer.from(userStringKey, 'base64')));
    const signPrivArray = new Uint8Array(Buffer.from(userStringSign, 'base64'));
    console.log("Opponent's kyber public key:", userStringKey);
    console.log("Sender's signing priv key:", userStringSign);


    const { ciphertextKem, encryptedMessage, encSharedSecret } = encryptMessage(kyberPubArray, message);
    console.log("This is the message", message);
    console.log("This is ", senderUsername, "'s ENC shared secret: ", encSharedSecret);

    // generate signature before storing 
    const signature = signMessage(signPrivArray, encryptedMessage);

    // convert to base 64 before creating new message
    const cipher64 = Buffer.from(ciphertextKem).toString("base64");
    const encrypted64 = Buffer.from(encryptedMessage).toString("base64");
    const signature64 = Buffer.from(signature).toString("base64");

    // creates a new message
    const newMessage = {
      sender: sender.username,
      receiver: receiver.username,
      content: message,
      timestamp: new Date(),
      ciphertextKem : cipher64,
      encryptedMsg : encrypted64,
      signature : signature64
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
  const senderUsername = searchParams.get("sender"); // switch for fetching/decrypting
  const receiverUsername = searchParams.get("receiver");

  if (!senderUsername || !receiverUsername) {
    return NextResponse.json({ error: "Missing sender or receiver name"});
  }

  const senderObj = await User.findOne({ username: senderUsername });
  const receiverObj = await User.findOne({ username: receiverUsername });

  //----Verify signature----
      // use recipient's signature to verify
      // = verifySignature(signPriv, encryptedMessage, signature) = must be true

      //----DECRYPTION----
      // use recipient's private key and encryptedText to decrypt text
      // generate decryptedText, decSharedSecret before storing
       // = decryptMessage(kyberPriv, ciphertextKem, encryptedMessage)
  try {
    // fetch recipient's private kyber key 
    const receiverPrivString = senderObj.kyberPriv;
    const signPubString = receiverObj.signPub;

    // query through chat between user1 and user2
    const chat = await Chat.findOne({ participants: { $all: [senderUsername, receiverUsername]}});

    if (!chat) {
      return NextResponse.json({error: "chat not found"}, {status: 404});
    }

    // now look for which one is the sender's signing public key 
    // check for index 0: if same as sender, then give it user1's sign key. if someone else other than sender, then take user2's key
    // opponent = receiver, sender = me
    const opponentPubStr = chat.participants[0] === receiverUsername ? chat.User1SignPriv : chat.User2SignPriv;

    // have to convert keys back to Uint8 array to use methods
    const receiverKyPrivArray = Array.from(new Uint8Array(Buffer.from(receiverPrivString, "base64")));
    const senderSignPubArray = new Uint8Array(Buffer.from(signPubString, "base64")); // before -> opponentPubStr

    console.log("Sender's (my own) kyber private key:", receiverKyPrivArray);
    console.log("Opponent's signing public key:", senderSignPubArray);
    
    // convert all the necessary keys: signature, any keys, ciphertext (base64) => (Uint8Array)
    // encryptedText will remain base64

    // decrypt messages before showing on chat page. iterate through each existing message between two users 
    const decryptedMessages = chat.messages.map((msg) => {
      console.log("Our message 1:", msg);
      const msgSign = new Uint8Array(Buffer.from(msg.signature, "base64"));
      const ciphertextKemArray = Array.from(new Uint8Array(Buffer.from(msg.ciphertextKem, "base64")));

      console.log("Ciphertext", msg.ciphertextKem);
      console.log("encrypted Msg: ", msg.encryptedMsg);
      console.log("Signature", msg.signature);

      if (!msg.encryptedMsg || !ciphertextKemArray|| !msgSign) {
          return msg; // check if all values exist 
      }

      if (msg.sender === senderUsername) {
        console.log("This msg is sent by me: ", senderUsername);
        // in this case message was SENT by me --> no need to decrypt, just verify signature
        const isValid = verifySignature(senderSignPubArray, msg.encryptedMsg, msgSign);
        return { ...msg.toObject(), content: isValid ? "[SENT MESSAGE]" : "[INVALID SIGNATURE]" };
      } else {
        try {
          // message was RECEIVED from opponent so SENDER: Decrypt any incoming message
          const {decryptedMessage, decSharedSecret } = decryptMessage(receiverKyPrivArray, ciphertextKemArray, msg.encryptedMsg);
          console.log("This is ", senderUsername, "'s DEC shared secret:", decSharedSecret);
  
          console.log("Decrypted message:", decryptedMessage);

          // must verify RECEIPIENT's signature with their pub key
          const isValid = verifySignature(senderSignPubArray, msg.encryptedMsg, msgSign);
          return { ...msg.toObject(), content: isValid ? decryptedMessage : "[INVALID SIGNATURE]" };
            
        } catch (error) {
            console.error("Decryption error:", error);
            return { ...msg.toObject(), content: "[DECRYPTION FAILED]" };
        }
      }
    });

  return NextResponse.json({ data: decryptedMessages });

  } catch (error) {
    console.error("Error in GET /api/messages", error);
    return NextResponse.json({ error: error.message}, {status: 500})
  }
}
