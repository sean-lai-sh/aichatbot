import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';

const Chatbox = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages([...messages, { text: inputValue, sender: 'user' }]);
      setInputValue('');
    }
  };

  return (
    <Box sx={{ width: 300, border: '1px solid #ccc', borderRadius: '8px', p: 2, boxShadow: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Welcome 👋 I'm your Assistant.</Typography>
      <Box sx={{ maxHeight: 300, overflowY: 'auto', mb: 2 }}>
        {messages.map((msg, index) => (
          <Box key={index} sx={{ mb: 1 }}>
            <Typography sx={{ fontWeight: msg.sender === 'user' ? 'bold' : 'normal' }}>
              {msg.text}
            </Typography>
          </Box>
        ))}
      </Box>
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        placeholder="Send us a message..."
      />
      <Button sx={{ mt: 1 }} variant="contained" color="primary" fullWidth onClick={handleSendMessage}>
        Send
      </Button>
    </Box>
  );
};

export default Chatbox;