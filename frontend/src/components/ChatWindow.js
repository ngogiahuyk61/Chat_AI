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

function ChatWindow({ messages, onBotReply }) {
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(null);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, loading]);

  // Hiệu ứng loading khi chờ bot trả lời
  useEffect(() => {
    if (loading) setPending('Đang soạn phản hồi...');
    else setPending(null);
  }, [loading]);

  // Giả lập gọi API và nhận phản hồi bot (demo, sẽ kết nối thật ở ChatInput)
  // useEffect(() => {
  //   if (messages.length && messages[messages.length-1].sender === 'user') {
  //     setLoading(true);
  //     setTimeout(() => {
  //       onBotReply('Đây là phản hồi mẫu từ bot.');
  //       setLoading(false);
  //     }, 1200);
  //   }
  // }, [messages]);

  return (
    <div className="chat-window" ref={chatRef}>
      {messages.map((msg, idx) => (
        <div key={idx} className={`msg ${msg.sender}`}> 
          {msg.sender === 'bot' ? <TypingEffect text={msg.content} /> : msg.content}
        </div>
      ))}
      {loading && <div className="msg bot loading">{pending}</div>}
    </div>
  );
}

export default ChatWindow; 