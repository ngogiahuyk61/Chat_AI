const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const logger = require('./middlewares/logger');
const chatRoutes = require('./routes/chat');
const ragRoutes = require('./routes/rag');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.use('/api', chatRoutes);
app.use('/api/rag', ragRoutes);

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

module.exports = app; 