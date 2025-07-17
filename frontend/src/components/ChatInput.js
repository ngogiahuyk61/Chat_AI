import React, { useState } from 'react';
import './ChatInput.css';

function ChatInput({ onSend }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    await onSend(input);
    setInput('');
    setLoading(false);
  };

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nhập tin nhắn..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={loading}
        autoFocus
      />
      <button type="submit" disabled={loading || !input.trim()}>Gửi</button>
    </form>
  );
}

export default ChatInput; 