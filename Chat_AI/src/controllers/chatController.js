const chatService = require('../services/chatService');
const Message = require('../models/message');

exports.chat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });
    // Lưu message user
    await Message.create({ sender: 'user', content: message });
    // Gọi AI agent
    const reply = await chatService.processMessage(message);
    // Lưu message bot
    await Message.create({ sender: 'bot', content: reply });
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 