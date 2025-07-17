const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.post('/chat', chatController.chat);
router.get('/conversations', chatController.getConversations);
router.get('/messages/:conversationId', chatController.getMessages);
router.post('/prompt', chatController.prompt);

module.exports = router; 