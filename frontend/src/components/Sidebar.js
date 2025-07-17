import React from 'react';
import './Sidebar.css';

function Sidebar({ conversations, currentId, setCurrentId, onNewChat }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <button className="new-chat" onClick={onNewChat}>+ New Chat</button>
      </div>
      <ul className="chat-list">
        {conversations.map((conv) => (
          <li
            key={conv.id}
            className={conv.id === currentId ? 'active' : ''}
            onClick={() => setCurrentId(conv.id)}
          >
            {conv.title || `Hội thoại #${conv.id}`}
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar; 