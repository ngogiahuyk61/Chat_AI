import React, { useEffect, useRef, useState } from 'react';
import './ChatWindow.css';

function TypingEffect({ text }) {
  const [display, setDisplay] = useState('');
  useEffect(() => {
    let i = 0;
    setDisplay('');
    if (!text) return;
    const interval = setInterval(() => {
      setDisplay((d) => d + text[i]);
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 18);
    return () => clearInterval(interval);
  }, [text]);
  return <span>{display}</span>;
}

function ChatWindow({ messages }) {
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  return (
    <div className="chat-window" ref={chatRef}>
      {messages.map((msg, idx) => (
        <div key={idx} className={`msg ${msg.sender}`}> 
          {msg.sender === 'bot' ? <TypingEffect text={msg.message || msg.content} /> : (msg.message || msg.content)}
        </div>
      ))}
    </div>
  );
}

export default ChatWindow; 