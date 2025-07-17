const chatBox = document.getElementById('chat-box');
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message');

function appendMessage(sender, text) {
  const div = document.createElement('div');
  div.className = sender;
  div.textContent = `${sender === 'user' ? 'Bạn' : 'Bot'}: ${text}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = messageInput.value.trim();
  if (!message) return;
  appendMessage('user', message);
  messageInput.value = '';
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    appendMessage('bot', data.reply);
  } catch {
    appendMessage('bot', 'Lỗi kết nối server.');
  }
}); 