const agent = require('../agent/agent');
 
exports.processMessage = async (message) => {
  // Gọi agent NLP (OpenAI hoặc AI nội bộ)
  return agent.getReply(message);
}; 