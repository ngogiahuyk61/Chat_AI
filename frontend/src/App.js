import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import './App.css';

function App() {
  const [conversations, setConversations] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [messages, setMessages] = useState([]);

  // Load danh sách hội thoại
  useEffect(() => {
    fetch('/api/conversations')
      .then(res => res.json())
      .then(setConversations);
  }, []);

  // Load messages khi chọn hội thoại
  useEffect(() => {
    if (currentId) {
      fetch(`/api/messages/${currentId}`)
        .then(res => res.json())
        .then(setMessages);
    } else {
      setMessages([]);
    }
  }, [currentId]);

  // Gửi prompt
  const handleSend = async (msg) => {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg, conversationId: currentId }),
    });
    const data = await res.json();
    setMessages((prev) => [...prev, ...data.messages]);
    if (!currentId) {
      setCurrentId(data.conversationId);
      setConversations((prev) => [{ id: data.conversationId, title: 'Hội thoại mới' }, ...prev]);
    }
  };

  // Tạo hội thoại mới
  const handleNewChat = () => {
    setCurrentId(null);
    setMessages([]);
  };

  return (
    <div className="app-root">
      <Sidebar
        conversations={conversations}
        currentId={currentId}
        setCurrentId={setCurrentId}
        onNewChat={handleNewChat}
      />
      <div className="main-area">
        <Topbar />
        <ChatWindow
          messages={messages}
        />
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}

export default App;
