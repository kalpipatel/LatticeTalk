"use client"

import React, { useState } from 'react';
import styles from './chat.module.css';

// ADDITIONS
// for message fetching and state
import useMessages from "../hooks/useMessages";

const ChatPage = () => {

  // current list of messages and a setter function to update them
  const { messages, setMessages } = useMessages();
  const [message, setMessage] = useState("");

  const sendMessage = async () => {

    if (!message.trim()) {
      console.error("Message is empty. Not sending.");
      return;
    }

    const messageData = {
      sender: "user1", // replace with actual sender
      receiver: "user2", // replace with actual receiver
      message: message.trim(), // ensures no extra spaces
  };

  console.log("Sending message:", messageData); // for debugging

  // sends a new chat message to the message API 
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender: "user1", receiver: "user2", message }),
    });

    // for debugging
    if (!response.ok) {
      throw new Error(`ERROR: ${response.status}`);
    }

    const result = await response.json();
    console.log("Server response:", result);

    if (result.data) {
      setMessages((prevMessages) => [...prevMessages, result.data]); 
    }

    console.log("message sent!!!");

    setMessage(""); // Clear input field
    } catch (error) {
      console.error("Error sending message:", error);
    }
      
  };


  return (
    <div className={styles.chatContainer}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarItem}>Search</div>
        <div className={styles.sidebarItem}>Contacts</div>
        <div className={styles.sidebarItem}>Settings</div>
      </div>

      {/* Main Chat Section */}
      <div className={styles.chatRoom}>
        <h2 className={styles.chatHeader}>Chat Room</h2>
        
        {/* Chat Messages */}
        <div className={styles.messages}>

          
         <div className={styles.friendMessage}>Friend msg</div>
          <div className={styles.friendMessage}>Friend msg</div>
          <div className={styles.friendMessage}>Friend msg</div>
          <div className={styles.myMessage}>My msg</div>
          <div className={styles.myMessage}>My msg</div>
           
        </div>

        {/* Chat Input */}
        <div className={styles.chatInputContainer}>
          <input className={styles.chatInput} 
          type="text" 
          placeholder="Chatbar: type message here" 
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
