// Query routes — handles question-answering about analyzed contracts
const express = require('express');
const rateLimit = require('express-rate-limit');
const authMiddleware = require('../middleware/authMiddleware');
const Document = require('../models/Document');
const { answerQuestion } = require('../services/aiService');

const router = express.Router();

// Rate limit: 30 requests per hour per IP
const queryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  message: { error: 'Too many questions. Please try again later.' }
});

// POST /api/query/:docId — ask a question about a contract
router.post('/:docId', authMiddleware, queryLimiter, async (req, res) => {
  try {
    const { question } = req.body;

    // Validate question
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Please provide a question.' });
    }

    if (question.length < 3 || question.length > 500) {
      return res.status(400).json({ error: 'Question must be between 3 and 500 characters.' });
    }

    // Find and verify document
    const document = await Document.findById(req.params.docId);

    if (!document) {
      return res.status(404).json({ error: 'Document not found.' });
    }

    if (document.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    if (document.status !== 'analyzed') {
      return res.status(400).json({ error: 'Document analysis is not complete yet.' });
    }

    // Get answer from AI
    const result = await answerQuestion(document.extractedText, question);

    res.json({
      answer: result.answer,
      sourceHint: result.sourceHint
    });
  } catch (err) {
    console.error('Query error:', err.message);
    res.status(500).json({ error: 'Failed to answer question. Please try again.' });
  }
});

module.exports = router;
