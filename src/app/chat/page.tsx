"use client"

import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import styles from './chat.module.css';
import { useUser } from '@/context/userContext';
import { encryptMessage } from '../../../BACKEND/encryption';

interface Message {
  sender: string;
  receiver: string;
  content?: string;
  timestamp?: string;
  ciphertext? : string;
  encrypted? : string;
  signature? : string;
  _id?: string;
}

const socket: Socket = io("http://localhost:3001", {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

const ChatPage = () => {

  const { user } = useUser();

  if (!user) {
    return <div>Please log in first. </div>;
  }

  const senderName = user.username;
  const senderKyberPub = user.kyberPub;
  const senderSignPub = user.signPub;

  const [receiverName, setReceiverName] = useState<string | null>(null);

  const [chatId, setChatId] = useState<string | null>(null);  // FIND THE CHAT ID between those two useers^^ // this is kpats and teja
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]); // Filtered users based on search query

  useEffect(() => {
    const fetchUsers = async (query: string) => {
      if (query) {
        try {
          const response = await fetch(`/api/search?query=${query}`);
          const result = await response.json();

          if (response.ok) {
            setFilteredUsers(result.users); // Set the filtered users based on query
          } else {
            setFilteredUsers([]); // Clear results if no users found
          }
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      } else {
        setFilteredUsers([]); // Clear results if the input is empty
      }
    };

    if (searchQuery) {
      fetchUsers(searchQuery); // Trigger the fetch when the searchQuery changes
    } else {
      setFilteredUsers([]); // Clear users if search query is empty
    }
  }, [searchQuery]);

  const handleUserClick = async (receiverUsername: string, receiverKyberPub: String, receiverSignPub: String) => {
    try {
      setMessages([]);

      const senderUsername = senderName; // Sender's username (from context or state)
      const senderKyberPub = user.kyberPub; // Sender's Kyber Public Key
      const senderSignPub = user.signPub; // Sender's Signature Public Key
  
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderUsername,
          receiverUsername,
          senderKyberPub,
          senderSignPub,
          receiverKyberPub,
          receiverSignPub,
        }),
      });
  
      const result = await response.json();
      if (response.ok) {

        const chat = result.chat;  // this allows us to access the participants, chatID, etc.

        console.log('Chat created or retrieved successfully:', result);
        setChatId(chat._id);
        setReceiverName(chat.participants.find((participant: string) => participant !== senderName));
        
      } else {
        console.error('Error creating chat:', result.error);
      }
    } catch (error) {
      console.error('Error fetching /api/chat:', error);
    }
  };


  useEffect(() => {
    socket.emit("register", senderName);
    if (chatId) {
      socket.emit("joinChat", chatId);

      socket.on("receiveMessage", (newMessage: Message) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
    }

    return () => {
      socket.off("receiveMessage");
    };
  }, [senderName, chatId]);

  useEffect(() => {
    const fetchMessages = async () => {

      try {
        console.log(senderName);
        console.log(receiverName);
        const response = await fetch(`/api/messages?sender=${senderName}&receiver=${receiverName}`);
        const result = await response.json();

        console.log("we are here!!!!")

        console.log(result.data)


        if (Array.isArray(result.data)) {
          setMessages(result.data); // Only set state if result is an array
        } else {
          console.error("Expected an array of messages, but got:", result);
        }

      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    if (chatId && receiverName) {
      console.log("Fetching messages for chatId:", chatId, "receiver:", receiverName);
      fetchMessages(); // Call fetchMessages when the component mounts or chatId changes
    }
  }, [chatId, receiverName]);

  const saveMessage = async () => {
    // makes a POST request to the backend api route to save message in database
  try {
    const response = await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        senderUsername: senderName,
        receiverUsername: receiverName,
        message: message.trim(),
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Message saved successfully:", data);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: senderName, receiver: receiverName ?? "", content:  message.trim()},
      ]);
    } else {
      console.error("Error saving message:", data.error);
    }
  } catch (error) {
    console.error("Error sending message:", error);
  }
    setMessage("");
  };

  useEffect(() => {
    socket.on("receiveMessage", async (newMessage: Message) => {
      console.log("New message received:", newMessage);

      /*
      // send the encrypted message to the backend for decryption
      const response = await fetch("/api/decryption", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            encryptedMessage: newMessage.content, // send the encrypted content
            privateKey: //?receiver, // Assume you have user's private key on the frontend
        }),
    });
        
      const data = await response.json();
      const decryptedMessage = data.decryptedMessage;
      */
      // Prevent duplicate messages
      setMessages((prevMessages) => {
        if (prevMessages.some(msg => msg._id === newMessage._id)) {
          return prevMessages; // Ignore duplicate message
        }
        //return [...prevMessages,  { ...newMessage, content: decryptedMessage }];
        return [...prevMessages,  newMessage];
      });
    });

    return () => {
      socket.off("receiveMessage"); // Cleanup to prevent duplicate listeners
    };
  }, [chatId, receiverName]); 

  return (
    <div className={styles.chatContainer}>

      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarItem}>
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search User"
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update search query
          />

          {/* Display Search Results */}
          {searchQuery && (
            <div className={styles.searchResults}>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user: { username: string; kyberPub: string; signPub: string }, index: number) => (
                  <div
                    key={index}
                    className={styles.userItem}
                    onClick={() => handleUserClick(user.username, user.kyberPub, user.signPub)}
                  >
                    {user.username}
                  </div>
                ))
              ) : (
                <div>No users found</div>
              )}
            </div>
          )}
        </div>
      </div>


      {/* Main Chat Section */}
      <div className={styles.chatRoom}>
        <h2 className={styles.chatHeader}>Chat Room</h2>

        {/* Chat Messages */}
        <div className={styles.messages}>
          {Array.isArray(messages) ? (
            messages.map((msg, index) => (
              <div
                key={msg._id || index}
                className={msg.sender === senderName ? styles.myMessage : styles.friendMessage}
              >
                {msg.content}
              </div>
            ))
          ) : (
            <div>No messages found</div>
          )}
        </div>
        <div className={styles.chatInputContainer}>
          <input className={styles.chatInput} type="text" placeholder="Type your message" value={message} onChange={(e) => setMessage(e.target.value)} />
          <button className={styles.sendButton} onClick={saveMessage}>➤</button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;