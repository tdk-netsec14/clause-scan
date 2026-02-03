// Document routes — CRUD operations, file upload, and report download
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
const authMiddleware = require('../middleware/authMiddleware');
const Document = require('../models/Document');
const { extractText } = require('../services/documentService');
const { generateReport } = require('../services/reportService');

const router = express.Router();

// Rate limit for uploads
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { error: 'Too many uploads. Please try again later.' }
});

// Multer configuration — PDF only, max 10MB
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimetypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'image/jpeg',
    'image/jpg'
  ];
  const allowedExts = ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.jpeg'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedMimetypes.includes(file.mimetype) && allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOCX, TXT, JPG, and JPEG files are accepted.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});

// GET /api/documents — list all user documents
router.get('/', authMiddleware, async (req, res) => {
  try {
    const documents = await Document.find({ userId: req.user.id })
      .select('-extractedText -clauses')
      .sort({ createdAt: -1 });

    res.json(documents);
  } catch (err) {
    console.error('List documents error:', err.message);
    res.status(500).json({ error: 'Failed to fetch documents.' });
  }
});

// GET /api/documents/:id — get full document with analysis
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ error: 'Document not found.' });
    }

    if (document.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    res.json(document);
  } catch (err) {
    console.error('Get document error:', err.message);
    res.status(500).json({ error: 'Failed to fetch document.' });
  }
});

// POST /api/documents/upload — upload a PDF file
router.post('/upload', authMiddleware, uploadLimiter, (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'File size must be under 10MB.' });
        }
        return res.status(400).json({ error: err.message });
      }
      return res.status(400).json({ error: err.message || 'Upload failed.' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    try {
      // Create document record
      const document = new Document({
        userId: req.user.id,
        originalName: req.file.originalname,
        filePath: req.file.path,
        status: 'extracting'
      });
      await document.save();

      // Respond immediately
      res.status(201).json({ success: true, documentId: document._id });

      // Extract text in background with timeout
      try {
        const extractWithTimeout = Promise.race([
          extractText(req.file.path),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Text extraction timed out after 30 seconds')), 30000))
        ]);
        const { fullText, pageCount } = await extractWithTimeout;
        document.extractedText = fullText;
        document.pageCount = pageCount;
        document.status = 'extracted';
        await document.save();
      } catch (extractErr) {
        document.status = 'error';
        document.errorMessage = extractErr.message;
        await document.save();
      }
    } catch (err) {
      console.error('Upload error:', err.message);
      res.status(500).json({ error: 'Failed to process upload.' });
    }
  });
});

// GET /api/documents/:id/report — download PDF report
router.get('/:id/report', authMiddleware, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ error: 'Document not found.' });
    }

    if (document.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    if (document.status !== 'analyzed') {
      return res.status(400).json({ error: 'Document analysis not complete.' });
    }

    generateReport(document, res);
  } catch (err) {
    console.error('Report error:', err.message);
    res.status(500).json({ error: 'Failed to generate report.' });
  }
});

// DELETE /api/documents/:id — delete document and file
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ error: 'Document not found.' });
    }

    if (document.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    // Delete file from filesystem
    if (document.filePath) {
      fs.unlink(document.filePath, (err) => {
        if (err) console.error('File delete error:', err.message);
      });
    }

    await Document.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('Delete error:', err.message);
    res.status(500).json({ error: 'Failed to delete document.' });
  }
});

module.exports = router;
