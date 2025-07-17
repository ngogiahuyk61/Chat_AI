const { OpenAI } = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function askOpenAI(prompt) {
  const res = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'Bạn là trợ lý AI.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.2,
    max_tokens: 1024,
  });
  return res.choices[0].message.content.trim();
}

module.exports = { askOpenAI }; 