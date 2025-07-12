import React, { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, TextField, Button, Avatar, Divider, List, ListItemAvatar, ListItemText, ListItemButton } from '@mui/material';
import { ChatMessage } from '../types';
import { ENDPOINTS } from '../api/endpoints';
import './Chat.css';

const DUMMY_CHATS = [
  { id: 1, name: 'Course FAQ', avatar: '🤖' },
  { id: 2, name: 'Lecture Notes', avatar: '📄' },
];

const Chat = (): React.JSX.Element => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [pendingBotMessage, setPendingBotMessage] = useState<string | null>(null);
  const [typingIndex, setTypingIndex] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, pendingBotMessage, typingIndex]);

  useEffect(() => {
    if (pendingBotMessage !== null) {
      if (typingIndex < pendingBotMessage.length) {
        const timeout = setTimeout(() => {
          setTypingIndex(typingIndex + 1);
        }, 3); // Typing speed (ms per character)
        return () => clearTimeout(timeout);
      } else {
        setMessages(prev => [...prev, { sender: 'bot', text: pendingBotMessage }]);
        setPendingBotMessage(null);
        setTypingIndex(0);
      }
    }
  }, [pendingBotMessage, typingIndex]);

  const handleSend = async (): Promise<void> => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setMessages(prev => [...prev, { sender: 'user', text: trimmed }]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(
        ENDPOINTS.chatQA(trimmed),
        { method: 'POST' }
      );
      const text = await response.text();
      let answer = text;
      try {
        // Try to parse as JSON and extract the answer field
        const json = JSON.parse(text);
        if (json.answer) answer = json.answer;
      } catch {}
      setPendingBotMessage(answer);
      setTypingIndex(0);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, something went wrong. Please try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <Box display="flex" height="100vh" width="100vw" bgcolor="#f4f6f9">
      {/* Sidebar */}
      <Box width={300} bgcolor="#1a1a2e" color="#fff" p={2} display={{ xs: 'none', md: 'flex' }} flexDirection="column" justifyContent="space-between">
        <Box>
          <Typography variant="h6" mb={2} fontWeight={700} letterSpacing={1} color="#fff">Chats</Typography>
          <List>
            {DUMMY_CHATS.map(chat => (
              <ListItemButton key={chat.id} sx={{ borderRadius: 2, mb: 1, bgcolor: chat.id === 1 ? '#23234a' : 'inherit' }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: '#23234a' }}>{chat.avatar}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={chat.name} primaryTypographyProps={{ color: '#fff' }} />
              </ListItemButton>
            ))}
          </List>
        </Box>
        <Box>
          <Divider sx={{ bgcolor: '#333', mb: 2 }} />
          <Button variant="outlined" color="inherit" fullWidth onClick={() => navigate('/')}>← Back to Home</Button>
        </Box>
      </Box>
      {/* Main Chat Area */}
      <Box flex={1} display="flex" flexDirection="column" maxWidth="100vw">
        <Box px={4} pt={3} pb={1}>
          <Typography variant="h5" fontWeight={700} color="#23234a">Course FAQ Chat</Typography>
        </Box>
        <Paper elevation={3} sx={{ flex: 1, m: 2, p: 3, overflowY: 'auto', borderRadius: 3, display: 'flex', flexDirection: 'column', gap: 2, background: '#fff' }}>
          {messages.length === 0 && !pendingBotMessage && (
            <Typography color="text.secondary" align="center" mt={8}>
              Start the conversation by asking a question!
            </Typography>
          )}
          {messages.map((msg, index) => (
            <Box key={index} display="flex" justifyContent={msg.sender === 'user' ? 'flex-end' : 'flex-start'} alignItems="flex-end">
              {msg.sender === 'bot' && (
                <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: '#e5e5ea', color: '#222', fontSize: 18 }}>🤖</Avatar>
              )}
              <Box className={`message-bubble ${msg.sender}`}>{msg.text}</Box>
              {msg.sender === 'user' && (
                <Avatar sx={{ width: 32, height: 32, ml: 1, bgcolor: '#2196f3', color: '#fff', fontSize: 18 }}>🧑</Avatar>
              )}
            </Box>
          ))}
          {pendingBotMessage && (
            <Box display="flex" justifyContent="flex-start" alignItems="flex-end">
              <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: '#e5e5ea', color: '#222', fontSize: 18 }}>🤖</Avatar>
              <Box className="message-bubble bot">
                {pendingBotMessage.slice(0, typingIndex)}
                <span className="blinking-cursor">|</span>
              </Box>
            </Box>
          )}
          <div ref={bottomRef} />
        </Paper>
        <Box display="flex" p={2} bgcolor="#fff" borderTop="1px solid #eee">
          <TextField
            fullWidth
            placeholder="Type your message…"
            value={input}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            size="small"
            sx={{ borderRadius: 2, background: '#f4f6f9' }}
            disabled={!!pendingBotMessage}
          />
          <Button variant="contained" sx={{ ml: 2, px: 4, borderRadius: 2 }} onClick={handleSend} disabled={loading || !input.trim() || !!pendingBotMessage}>
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Chat; 