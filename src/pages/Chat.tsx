import React, { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './Chat.css';
import { ChatMessage } from '../types';

const Chat = (): JSX.Element => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (): Promise<void> => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setMessages(prev => [...prev, { sender: 'user', text: trimmed }]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(
        `https://l6ea96uy70.execute-api.us-east-2.amazonaws.com/prod/qa?q=${encodeURIComponent(trimmed)}`,
        { method: 'POST' }
      );
      const data = await response.json();
      setMessages(prev => [...prev, { sender: 'bot', text: data.answer }]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, something went wrong. Please try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="chat-container">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Home
      </button>

      <h2 className="chat-header">Course FAQ Chat</h2>

      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {loading && <div className="message bot">Bot is typing...</div>}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Ask a question…"
          value={input}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Chat; 