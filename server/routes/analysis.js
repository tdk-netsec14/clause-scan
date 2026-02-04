// Analysis routes — runs the parallel AI pipeline for faster analysis.
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Document = require('../models/Document');
const {
  analyzeContract,
  calculateHealthScore,
  generateSummary,
  translateToHindi
} = require('../services/aiService');
const { compareDocumentToLawBook } = require('../services/lawBookService');

const router = express.Router();

// POST /api/analysis/:docId — start analysis pipeline
router.post('/:docId', authMiddleware, async (req, res) => {
  try {
    const document = await Document.findById(req.params.docId);

    if (!document) {
      return res.status(404).json({ error: 'Document not found.' });
    }

    if (document.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    if (!document.extractedText) {
      return res.status(400).json({ error: 'Document text not yet extracted. Please wait.' });
    }

    res.json({ success: true, message: 'Analysis started' });

    runAnalysis(document._id, document.extractedText);
  } catch (err) {
    console.error('Analysis trigger error:', err.message);
    res.status(500).json({ error: 'Failed to start analysis.' });
  }
});

async function runAnalysis(docId, extractedText) {
  try {
    await Document.findByIdAndUpdate(docId, { status: 'analyzing' });

    // ── Step 1: Core AI analysis ──
    const analysisResult = await analyzeContract(extractedText);

    // ── Step 2: Health score + law book comparison (synchronous, fast) ──
    const clauses = Array.isArray(analysisResult.clauses) ? analysisResult.clauses : [];
    const missingClauses = Array.isArray(analysisResult.missingClauses) ? analysisResult.missingClauses : [];
    const loopholes = Array.isArray(analysisResult.loopholes) ? analysisResult.loopholes : [];
    const redFlags = Array.isArray(analysisResult.redFlags) ? analysisResult.redFlags : [];
    const negotiationPoints = Array.isArray(analysisResult.negotiationPoints) ? analysisResult.negotiationPoints : [];

    const healthScore = calculateHealthScore(clauses, missingClauses, loopholes);

    const overallRiskScore = clauses.length > 0
      ? Math.round(clauses.reduce((sum, clause) => sum + (clause.riskScore || 0), 0) / clauses.length)
      : 0;

    // Law book comparison (runs locally, very fast)
    let lawReview = { overview: '', findings: [], matchedActs: [] };
    try {
      const lawResult = compareDocumentToLawBook({
        fullText: extractedText,
        clauses,
        missingClauses,
        loopholes
      });

      // Enrich clauses with law references
      if (lawResult.clauseInsights) {
        for (const insight of lawResult.clauseInsights) {
          const clause = clauses.find(c => c.id === insight.clauseId);
          if (clause) {
            clause.lawReferences = insight.lawReferences || [];
            if (insight.jurisdictionWarning && !clause.jurisdictionWarning) {
              clause.jurisdictionWarning = insight.jurisdictionWarning;
            }
          }
        }
      }

      lawReview = lawResult.reviewSummary || lawReview;
    } catch (lawErr) {
      console.error('Law book comparison failed (non-fatal):', lawErr.message);
    }

    // Save intermediate results so frontend can show partial data faster
    await Document.findByIdAndUpdate(docId, {
      clauses,
      missingClauses,
      loopholes,
      redFlags,
      negotiationPoints,
      healthScore,
      overallRiskScore,
      lawReview
    });

    // ── Step 3: Summary + Hindi translation in PARALLEL ──
    const englishSummary = await generateSummary(analysisResult);
    const hindiSummary = await translateToHindi(englishSummary);

    await Document.findByIdAndUpdate(docId, {
      'summary.english': englishSummary,
      'summary.hindi': hindiSummary,
      status: 'analyzed'
    });
  } catch (err) {
    console.error('Analysis pipeline failed:', err.message);
    await Document.findByIdAndUpdate(docId, {
      status: 'error',
      errorMessage: err.message
    });
  }
}

module.exports = router;