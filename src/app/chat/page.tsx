"use client";

import React, { useState, useEffect } from 'react';
import styles from './chat.module.css';

// Define interfaces
interface Message {
  sender: string;
  receiver: string;
  message: string;
  _id?: string;
  timestamp?: string;
}

interface Chat {
  _id: string;
  user1: string;
  user2: string;
  latestMessage: string;
  updatedAt: Date;
}

interface User {
  username: string;
}

// Define props for ChatList component
interface ChatListProps {
  senderId: string;
  receiverId: string;
}

const ChatPage = () => {
  const [senderId, setSenderId] = useState('67c8ed1e13327778cdb114a1');
  const [receiverId, setReceiverId] = useState('67c8eddcfa3b840f1c62ad4f');
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const fetchUserIds = async () => {
      try {
        const response = await fetch('/api/users'); // API to get users
        const result = await response.json();

        if (result.users) {
          const john = result.users.find((user: any) => user.username === "john");
          const cam = result.users.find((user: any) => user.username === "cam");

          if (john && cam) {
            setSenderId(john._id);
            setReceiverId(cam._id);
          } else {
            console.error("Users not found.");
          }
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUserIds();
  }, []);

  // Fetch messages when senderId or receiverId changes
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/messages?sender=${senderId}&receiver=${receiverId}`);
        const result = await response.json();
        if (result.data) {
          setMessages(result.data);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [senderId, receiverId]);

  // ChatList component with proper prop types
  const ChatList: React.FC<ChatListProps> = ({ senderId, receiverId }) => {
    const [chats, setChats] = useState<Chat[]>([]);

    useEffect(() => {
      if (!senderId) return; // ensure senderId is available before fetching

      const fetchChats = async () => {
        try {
          const response = await fetch(`/api/chats?userId=${senderId}`);
          const result = await response.json();
          setChats(result.chats || []);
        } catch (error) {
          console.error("Error fetching chats:", error);
        }
      };

      fetchChats();
    }, [senderId]);

    // In this example, we are not filtering the chats.
    const filteredChats = chats;

    return (
      <div className="chat-list space-y-2 p-4">
        {filteredChats.map((chat) => (
          <div key={chat._id} className="flex items-center p-2 border rounded-lg shadow-md bg-white">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{chat.user1}</h3>
              <p className="text-sm text-gray-500 truncate">{chat.latestMessage}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const sendMessage = async () => {
    if (!message.trim()) {
      console.error("Message is empty. Not sending.");
      return;
    }

    const messageData = {
      senderId,
      receiverId,
      message: message.trim(),
    };

    console.log("Sending message:", messageData);

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) {
        throw new Error(`ERROR: ${response.status}`);
      }

      const result = await response.json();
      console.log("Server response:", result);

      if (result.message) {
        console.log("Message sent successfully");
        setMessages((prevMessages) => [...prevMessages, result.data as Message]);
        setMessage(""); // Clear input field
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  

  return (
    <div className={styles.chatContainer}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <input placeholder="Search" className={styles.sidebarItem} />
        
        <div className={styles.sidebarItem}>Contacts</div>
        <div className={styles.sidebarItem}>Settings</div>
        <div className={styles.sideChats}>
          {/* Optionally render the ChatList component */}
          <ChatList senderId={senderId} receiverId={receiverId} />
        </div>
      </div>

      {/* Main Chat Section */}
      <div className={styles.chatRoom}>
        <h2 className={styles.chatHeader}>Chat Room</h2>
        
        {/* Chat Messages */}
        <div className={styles.messages}>
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={msg.sender === senderId ? styles.myMessage : styles.friendMessage}
            >
              {msg.message}
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className={styles.chatInputContainer}>
          <input
            className={styles.chatInput}
            type="text"
            placeholder="Type your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className={styles.sendButton} onClick={sendMessage}>➤</button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
