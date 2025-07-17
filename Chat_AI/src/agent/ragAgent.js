const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { OpenAIEmbeddings } = require('@langchain/openai');
const { RecursiveCharacterTextSplitter } = require('langchain/textsplitters');
const path = require('path');

const VECTOR_STORE_PATH = path.join(__dirname, 'vectorstore.json');

async function extractTextFromPDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
}

async function extractTextFromDOCX(filePath) {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
}

async function embedAndStore(text, source = 'unknown') {
  const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 512, chunkOverlap: 64 });
  const docs = await splitter.createDocuments([text]);
  const embedder = new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY });
  const vectors = [];
  for (const doc of docs) {
    const embedding = await embedder.embedQuery(doc.pageContent);
    vectors.push({ embedding, content: doc.pageContent, source });
  }
  let store = [];
  if (fs.existsSync(VECTOR_STORE_PATH)) {
    store = JSON.parse(fs.readFileSync(VECTOR_STORE_PATH, 'utf8'));
  }
  store = store.concat(vectors);
  fs.writeFileSync(VECTOR_STORE_PATH, JSON.stringify(store, null, 2));
}

function cosineSimilarity(a, b) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function searchRelevantChunks(query, topK = 3) {
  if (!fs.existsSync(VECTOR_STORE_PATH)) return [];
  const store = JSON.parse(fs.readFileSync(VECTOR_STORE_PATH, 'utf8'));
  const embedder = new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY });
  const queryVec = await embedder.embedQuery(query);
  const scored = store.map((item) => ({ ...item, score: cosineSimilarity(queryVec, item.embedding) }));
  return scored.sort((a, b) => b.score - a.score).slice(0, topK);
}

async function askRAG(prompt) {
  const contextChunks = await searchRelevantChunks(prompt, 3);
  const context = contextChunks.map((c) => c.content).join('\n---\n');
  // Gọi OpenAI với context (nếu có key), hoặc trả về context thô
  if (process.env.OPENAI_API_KEY) {
    const { askOpenAI } = require('./openaiAgent');
    return askOpenAI(`Trả lời dựa trên ngữ cảnh sau:\n${context}\n\nCâu hỏi: ${prompt}`);
  }
  return `Context tìm được:\n${context}\n\nKhông có OpenAI API key để sinh phản hồi.`;
}

module.exports = {
  extractTextFromPDF,
  extractTextFromDOCX,
  embedAndStore,
  askRAG,
}; 