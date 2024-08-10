'use client'
import { Box, Button, Stack, TextField} from "@mui/material";
import Image from "next/image";
import { useState } from "react";
export default function Home() {

  const [messages, setMessages] = useState([{
    role: "assistant",
    content: "Hi I'm your virtual assistant. How can I help you today?",
  
  }]);
  /// TODO: Please learn what this actually does, this is like black magic to me
  const sendMessage = async () => {
    if (!message.trim()) return;  // Don't send empty messages
  
    setMessage('')
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ])
  
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, { role: 'user', content: message }]),
      })
  
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
  
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
  
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const text = decoder.decode(value, { stream: true })
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1)
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ]
        })
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ])
    }
  }

  const [message, setMessage] = useState("");
  return (
    <Box width={`100vw`} height={`100vh`} display={"flex"} alignItems={`center`} justifyContent={`center`} flexDirection={`column`}>
      <Stack direction={"column"} width="600px" height ="700px" border={`1px solid black`} p={2} spacing={3}>
        <Stack direction={"column"} spacing={2} flexGrow={1} overflow="auto" maxHeight={`100%`}>
          {
            messages.map((message, index) => (
              <Box key={index} display={`flex`} justifyContent={message.role === 'assistant' ? "flex-start" : "flex-end"}>
                {/* <Image src={message.role === "assistant" ? "/assistant.png" : "/user.png"} width={50} height={50} /> */}
                {/* Can change the bgcolors if we want. Check MUI docs */}
                <Box p={3} borderRadius={16} bgcolor={message.role === "assistant" ? "primary.main" : "secondary.main"} color={"white"}>
                  {message.content}
                </Box>
              </Box>
            ))
          }
        </Stack>
        <Stack direction={"row"} justifyContent={`flex-end`} spacing={2} >
          <TextField
            label = "Type your message"
            fullWidth
            multiline
            maxRows={4}
            value={message} 
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button variant="contained" onClick={sendMessage}>Send</Button>
        </Stack>
      </Stack>
    </Box>
  );
}
