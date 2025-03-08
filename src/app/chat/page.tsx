"use client"

import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import styles from './chat.module.css';

interface Message {
  sender: string;
  receiver: string;
  message: string;
  _id?: string;
  timestamp?: string;
}

const socket: Socket = io("http://localhost:3001", {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

const ChatPage = () => {
  const [senderId, setSenderId] = useState('67c8ed1e13327778cdb114a1');
  const [receiverId, setReceiverId] = useState('67c8eddcfa3b840f1c62ad4f');
  const [chatId, setChatId] = useState("67ca2ef91ef56b74041ca020");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  //Search Button
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [savedSearch, setSavedSearch] = useState(""); //Searched user variable

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

  useEffect(() => {
    socket.emit("register", senderId);
    socket.emit("joinChat", chatId);

    socket.on("receiveMessage", (newMessage: Message) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [senderId, chatId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`http://localhost:3001/messages/${chatId}`);
        const result = await response.json();
        if (result) {
          setMessages(result);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [chatId]);

  const sendMessage = async () => {
    if (!message.trim()) {
      return;
    }

    const messageData = {
      senderId,
      receiverId,
      message: message.trim(),
      chatId,
      encryptedMsg: "",
      ciphertextKem: "",
      signature: "",
    };

    socket.emit("sendMessage", messageData);

    setMessage("");
  };

  useEffect(() => {
    socket.on("receiveMessage", (newMessage: Message) => {
      console.log("📩 New message received:", newMessage);

      // Prevent duplicate messages
      setMessages((prevMessages) => {
        if (prevMessages.some(msg => msg._id === newMessage._id)) {
          return prevMessages; // Ignore duplicate message
        }
        return [...prevMessages, newMessage];
      });
    });

    return () => {
      socket.off("receiveMessage"); // Cleanup to prevent duplicate listeners
    };
  }, []);


  return (
    <div className={styles.chatContainer}>

      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div
          className={styles.sidebarItem}
          onClick={() => setSearchVisible(true)}
        >
          {searchVisible ? (
            <input
              type="text"
              placeholder="Search User"
              className={styles.searchInput}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  console.log("Enter pressed!!! Saving search:", searchInput);
                  setSavedSearch(searchInput);
                  setSearchInput("");
                  setSearchVisible(false);
                }
              }}
              autoFocus
            />
          ) : (
            "Search User"
          )}
        </div>

        {/* Settings */}
        <div className={styles.sidebarItem}>Settings</div>


      </div>

      {/* Main Chat Section */}
      <div className={styles.chatRoom}>
        <h2 className={styles.chatHeader}>Chat Room</h2>

        {/* Chat Messages */}
        <div className={styles.messages}>
          {messages.map((msg, index) => (
            <div
              key={msg._id || index}
              className={msg.sender === senderId ? styles.myMessage : styles.friendMessage}
            >
              {msg.message}
            </div>
          ))}
        </div>
        <div className={styles.chatInputContainer}>
          <input className={styles.chatInput} type="text" placeholder="Type your message" value={message} onChange={(e) => setMessage(e.target.value)} />
          <button className={styles.sendButton} onClick={sendMessage}>➤</button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
