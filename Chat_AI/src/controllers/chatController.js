const { Conversation, Message, Document } = require('../../../models');
const chatService = require('../services/chatService');

exports.chat = async (req, res) => {
  try {
    const { message, conversationId } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });
    let conv;
    if (conversationId) {
      conv = await Conversation.findByPk(conversationId);
      if (!conv) return res.status(404).json({ error: 'Conversation not found' });
    } else {
      conv = await Conversation.create({ title: 'Hội thoại mới', created_at: new Date() });
    }
    const userMsg = await Message.create({
      conversation_id: conv.id,
      sender: 'user',
      message,
      created_at: new Date(),
    });
    const reply = await chatService.processMessage(message);
    const botMsg = await Message.create({
      conversation_id: conv.id,
      sender: 'bot',
      message: reply,
      created_at: new Date(),
    });
    res.json({ conversationId: conv.id, messages: [userMsg, botMsg], reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const convs = await Conversation.findAll({ order: [['created_at', 'DESC']] });
    res.json(convs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const msgs = await Message.findAll({
      where: { conversation_id: conversationId },
      order: [['created_at', 'ASC']],
    });
    res.json(msgs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.prompt = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });
    const reply = await chatService.processMessage(prompt);
    // Lưu prompt + response vào DB (Document)
    await Document.create({ title: prompt, file_path: '', embedded: false });
    res.json({ prompt, reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 