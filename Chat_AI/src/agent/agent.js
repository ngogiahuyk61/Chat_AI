const { askOpenAI } = require('./openaiAgent');
const { askRAG } = require('./ragAgent');

exports.getReply = async (message) => {
  // Thử gọi OpenAI trước, nếu lỗi hoặc không có key thì fallback sang RAG
  if (process.env.OPENAI_API_KEY) {
    try {
      const reply = await askOpenAI(message);
      if (reply && reply.length > 0) return reply;
    } catch (err) {
      // Nếu lỗi, fallback sang RAG
    }
  }
  // Nếu không có key hoặc OpenAI lỗi, dùng RAG
  return askRAG(message);
}; 