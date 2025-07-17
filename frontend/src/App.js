import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import './App.css';

function App() {
  const [conversations, setConversations] = useState([
    { id: 1, title: 'Hội thoại mới', messages: [] },
  ]);
  const [currentId, setCurrentId] = useState(1);

  const currentConv = conversations.find((c) => c.id === currentId);

  // Gửi message, gọi API, cập nhật hội thoại
  const handleSend = async (msg) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === currentId
          ? { ...c, messages: [...c.messages, { sender: 'user', content: msg }] }
          : c
      )
    );
    // Loading message
    setConversations((prev) =>
      prev.map((c) =>
        c.id === currentId
          ? { ...c, messages: [...c.messages, { sender: 'bot', content: '...' }] }
          : c
      )
    );
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== currentId) return c;
          // Xóa message bot '...' cuối cùng, thêm message bot thật
          const msgs = [...c.messages];
          if (msgs.length && msgs[msgs.length - 1].sender === 'bot' && msgs[msgs.length - 1].content === '...') {
            msgs.pop();
          }
          return {
            ...c,
            messages: [...msgs, { sender: 'bot', content: data.reply }],
          };
        })
      );
    } catch {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== currentId) return c;
          const msgs = [...c.messages];
          if (msgs.length && msgs[msgs.length - 1].sender === 'bot' && msgs[msgs.length - 1].content === '...') {
            msgs.pop();
          }
          return {
            ...c,
            messages: [...msgs, { sender: 'bot', content: 'Lỗi kết nối server.' }],
          };
        })
      );
    }
  };

  const handleNewChat = () => {
    const newId = Date.now();
    setConversations((prev) => [
      { id: newId, title: 'Hội thoại mới', messages: [] },
      ...prev,
    ]);
    setCurrentId(newId);
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
          messages={currentConv?.messages || []}
        />
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}

export default App;
