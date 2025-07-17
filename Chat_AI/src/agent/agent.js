const { askOpenAI } = require('./openaiAgent');
const { askRAG } = require('./ragAgent');

exports.getReply = async (message) => {
  if (process.env.OPENAI_API_KEY) {
    return askOpenAI(message);
  }
  return askRAG(message);
}; 