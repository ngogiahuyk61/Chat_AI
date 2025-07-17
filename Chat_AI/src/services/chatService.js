const agent = require('../agent/agent');
 
exports.processMessage = async (message) => {
  // Gọi agent NLP (OpenAI hoặc AI nội bộ, tuần tự)
  return agent.getReply(message);
}; 