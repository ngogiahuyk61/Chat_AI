const express = require('express');
const multer = require('multer');
const path = require('path');
const { extractTextFromPDF, extractTextFromDOCX, embedAndStore } = require('../agent/ragAgent');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });
    let text = '';
    if (file.mimetype === 'application/pdf') {
      text = await extractTextFromPDF(file.path);
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      text = await extractTextFromDOCX(file.path);
    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }
    await embedAndStore(text, file.originalname);
    res.json({ message: 'File processed and embedded successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 