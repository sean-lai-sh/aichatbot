'use client'
import { Box, Button, Stack, TextField } from "@mui/material";
import Image from "next/image";
import { useState, useEffect } from "react";
import ChatModal from "./chatboxmodal";
import Chatbox from "./gptchatbox";

export default function Home() {

  const [messages, setMessages] = useState([{
    role: "assistant",
    content: "Hi I'm your virtual assistant. How can I help you today?",
  }]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state for AI response
  const [isTyping, setIsTyping] = useState(false);   // Typing indicator state

  const sendMessage = async () => {
    if (!message.trim()) return;  // Don't send empty messages
    
    setIsLoading(true); // Set loading state
    setMessage('')
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '...' }, // Show loading indicator
    ]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, { role: 'user', content: message }]),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let aiResponse = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        aiResponse += text;

        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: aiResponse }, // Update AI message content
          ];
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ]);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  // Handle typing indicator
  useEffect(() => {
    if (message.length > 0) {
      setIsTyping(true);
    } else {
      setIsTyping(false);
    }
  }, [message]);

  return (
    <>
    <p> hello world</p>
    <ChatModal/ >
    </>
  );
}
