"use client"

import React, { useState, useEffect } from 'react';
import styles from './chat.module.css';

// for message fetching and state
//import useMessages from "../hooks/useMessages";

interface Message {
  sender: string;
  receiver: string;
  message: string;
  _id?: string;
  timestamp?: string;
}

const ChatPage = () => {

  const [senderId, setSenderId] = useState('67c8ed1e13327778cdb114a1');
  const [receiverId, setReceiverId] = useState('67c8eddcfa3b840f1c62ad4f');
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

  // fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/messages?sender=${senderId}&receiver=${receiverId}`);
        const result = await response.json();
        if (result.data) {
          setMessages(result.data); // Set fetched messages to state
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [senderId, receiverId]);

  const sendMessage = async () => {

    if (!message.trim()) {
      console.error("Message is empty. Not sending.");
      return;
    }

    // const messageData = {
    //   senderId, // replace with actual sender
    //   receiverId, // replace with actual receiver
    //   message: message.trim(), // ensures no extra spaces
    // };

    // console.log("Sending message:", messageData); // for debugging

  // sends a new chat message to the message API 
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId, receiverId, message}),
        //body: JSON.stringify( { sender: "user1", receiver: "user2", ciphertextKem :, encryptedMsg : , signature :}),
    });

    // for debugging
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
        {messages.map((msg) => (
    <div
      key={msg.timestamp}
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
