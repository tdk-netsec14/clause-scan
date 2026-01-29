// Document model — stores uploaded contracts and all AI analysis results
const mongoose = require('mongoose');

const clauseSchema = new mongoose.Schema({
  id: String,
  heading: String,
  text: String,
  type: String,
  riskScore: Number,
  riskReason: String,
  suggestedRevision: String,
  favorability: {
    type: String,
    enum: ['favors_you', 'neutral', 'favors_other_party']
  },
  loophole: String,
  jurisdictionWarning: String,
  lawReferences: [
    {
      source: String,
      section: String,
      relevance: String,
      note: String
    }
  ]
}, { _id: false });

const missingClauseSchema = new mongoose.Schema({
  clauseType: String,
  importance: {
    type: String,
    enum: ['critical', 'high', 'medium']
  },
  explanation: String,
  recommendation: String
}, { _id: false });

const loopholeSchema = new mongoose.Schema({
  heading: String,
  description: String,
  risk: String,
  suggestion: String
}, { _id: false });

const documentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  filePath: String,
  status: {
    type: String,
    enum: ['uploaded', 'extracting', 'extracted', 'analyzing', 'analyzed', 'error'],
    default: 'uploaded'
  },
  extractedText: String,
  pageCount: Number,
  clauses: [clauseSchema],
  missingClauses: [missingClauseSchema],
  loopholes: [loopholeSchema],
  redFlags: [String],
  negotiationPoints: [String],
  healthScore: {
    grade: String,
    percentage: Number,
    label: String
  },
  overallRiskScore: Number,
  summary: {
    english: String,
    hindi: String
  },
  lawReview: {
    overview: String,
    findings: [String],
    matchedActs: [String]
  },
  errorMessage: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Document', documentSchema);
