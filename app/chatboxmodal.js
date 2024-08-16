'use client'
import React, { useState, useEffect } from 'react';
import { Box, Button, Stack, TextField, Drawer, IconButton, Typography } from "@mui/material";
import { ChatBubbleOutline, Close } from '@mui/icons-material';


const ChatDrawer = () => {
  const [open, setOpen] = useState(true);
  const [messages, setMessages] = useState([{
    role: "assistant",
    content: "Hi I'm your virtual assistant. How can I help you today?",
  }, {role: "user",
    content: "Hi I'm your virtual assistant. How can I help you today?",}]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const handleToggle = () => setOpen(!open);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    setMessage('')
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '...' },
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
            { ...lastMessage, content: aiResponse },
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
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (message.length > 0) {
      setIsTyping(true);
    } else {
      setIsTyping(false);
    }
  }, [message]);

  return (
    <>
      {/* Floating Chat Button */}
      {/* {!open && (
        <IconButton 
          onClick={handleToggle} 
          style={{
            position: 'fixed', 
            bottom: '20px', 
            right: '20px', 
            backgroundColor: '#1976d2', 
            color: 'white'
          }}
          size="large"
        >
          <ChatBubbleOutline />
        </IconButton>
      )} */}

      {/* Persistent Drawer containing the Chat UI */}
      {/* <div className='test'> */}
      <Drawer
        variant="persistent"
        anchor="right"
        open={open}
        onClose={handleToggle}
        sx={{
          bottom: 0,
          position: 'fixed',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          maxHeight: '700px',
          right: 0,  // Ensure it's aligned to the right
        }}
        PaperProps={{
          sx: {
            borderRadius: `16px`,
          },
        }}
      > 
        {/* Header with Bl ue Bar and Close Button */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          bgcolor="primary.main"
          p={2}
          width="100%"
        >
          <Typography variant="h6" color="white">Chat</Typography>
          <IconButton onClick={handleToggle} sx={{backgroundColor: 'primary.main',
          '& .MuiOutlinedInput-root': {
            color: 'white',
            '& fieldset': {
              
            },
            '&:hover fieldset': {
              borderColor: 'white',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'white',
            },}}}>
            <Close />
          </IconButton>
        </Box>

        {/* Chat Content */}
        <Stack direction="column" spacing={2} flexGrow={1} overflow="auto" maxHeight="60%" padding={`2px`}>
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={message.role === 'assistant' ? 'flex-start' : 'flex-end'}
              width="100%"
            >
              <Box
                p={3}
                borderRadius={16}
                bgcolor={message.role === 'assistant' ? 'primary.main' : 'secondary.main'}
                color="white"
                maxWidth="80%"
              >
                {message.content}
              </Box>
            </Box>
          ))}
          {isTyping && (
            <Box key="Typing indicator" display="flex" justifyContent="flex-end">
              <Box p={3} borderRadius={16} bgcolor="secondary.main" color="grey.500">
                Typing...
              </Box>
            </Box>
          )}
        </Stack>
        
        {/* Message Input and Send Button */}
        <Stack direction="row" justifyContent="flex-end" spacing={2} p={2}>
          <TextField
            label="Type your message"
            fullWidth
            multiline
            maxRows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button variant="contained" onClick={sendMessage}>
            Send
          </Button>
        </Stack>
        
      </Drawer>
      {/* </div> */}
    </>
  );
};

export default ChatDrawer;
