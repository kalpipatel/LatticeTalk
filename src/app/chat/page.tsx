"use client"

import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import styles from './chat.module.css';
import { useUser } from '@/context/userContext';

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

  const { user } = useUser();

  if (!user) {
    return <div>Please log in first. </div>;
  }

  const senderName = user.username;
  const receiverName = "cam"; // TEJAA FIND THE RECIVER NAMEEEEEEEE and assign it to this variable

  const [chatId, setChatId] = useState("67ca2ef91ef56b74041ca020");  // FIND THE CHAT ID between those two useers^^
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [filteredUsers, setFilteredUsers] = useState<[]>([]); // Filtered users based on search query


  //Search Button
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [savedSearch, setSavedSearch] = useState(""); //Searched user variable


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
        const response = await fetch(`/api/messages?sender=${senderName}&receiver=${receiverName}`);
        const result = await response.json();
        console.log(result); // Log the API response

        if (Array.isArray(result.data)) {
          setMessages(result.data); // Only set state if result is an array
        } else {
          console.error("Expected an array of messages, but got:", result);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
  }, [chatId, receiverName]);

  const sendMessage = async () => {
    if (!message.trim()) {
      return;
    }

    const messageData = {
      senderName,
      receiverName,
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
      console.log("New message received:", newMessage);

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

  // useEffect(() => {
  //   const fetchFilteredUsers = async () => {
  //     try {
  //       // Fetch from the backend running on port 3001
  //       const response = await fetch(`http://localhost:3001/search?query=${searchQuery}`);
  //       const result = await response.json();

  //       if (response.ok) {
  //         setFilteredUsers(result.users); // Update filtered users based on the query
  //       } else {
  //         setFilteredUsers([]); // Clear users if no match
  //       }
  //     } catch (error) {
  //       // Log error and check for specific error
  //       console.error("Error fetching users:", error);
  //       if (error instanceof Error && error.message.includes("404")) {
  //         // If error contains 404, show a custom message
  //         console.log("User not found");
  //       }
  //     }
  //   };

  //   if (searchQuery) {
  //     fetchFilteredUsers();
  //   } else {
  //     setFilteredUsers([]); // Clear users if search query is empty
  //   }
  // }, [searchQuery]); // Re-run effect every time the searchQuery changes


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
          {Array.isArray(messages) ? (
            messages.map((msg, index) => (
              <div
                key={msg._id || index}
                className={msg.sender === senderName ? styles.myMessage : styles.friendMessage}
              >
                {msg.message}
              </div>
            ))
          ) : (
            <div>No messages found</div>
          )}
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