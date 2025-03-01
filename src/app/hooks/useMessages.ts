// this file defines a React Hook that fetches messages from the API and manages them
import { useState, useEffect } from "react";

// defines message
interface Message {
    sender: string;
    receiver: string;
    message: string;
    _id?: string; // generated automatically
    timestamp?: string;
  }

const useMessages = () => {
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        // this functions calls the API route to get the messages. it parses the response and updates messages
        const fetchMessages = async () => {
            try {
                const response = await fetch("/api/messages"); 
                const data = await response.json();
                console.log("Fetched messages:", data); // for debugging
                setMessages(data);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchMessages();
    }, []);

    return { messages, setMessages };
};

export default useMessages;
