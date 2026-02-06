// Law book service — compares contract clauses against Indian contract law references
const lawBook = require('../data/lawBook.json');

const MAX_REFERENCES_PER_CLAUSE = 2;
const MAX_FINDINGS = 3;

const normalizeText = (text) => (text || '').toLowerCase().replace(/\s+/g, ' ').trim();

const mergeUnique = (items) => [...new Set(items.filter(Boolean))];

const scoreRuleMatch = (haystack, rule) => {
  let score = 0;

  for (const keyword of rule.keywords || []) {
    if (haystack.includes(keyword)) {
      score += 2;
    }
  }

  for (const clauseType of rule.clauseTypes || []) {
    if (haystack.includes(clauseType.replace(/_/g, ' '))) {
      score += 3;
    }
  }

  return score;
};

const buildLawReferences = (rule) => {
  return (rule.references || []).slice(0, MAX_REFERENCES_PER_CLAUSE).map((reference) => ({
    source: reference.act,
    section: reference.section,
    relevance: rule.reviewFocus,
    note: reference.note
  }));
};

const describeClauseType = (clauseType) => {
  if (!clauseType) return 'General clause';
  return clauseType
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (match) => match.toUpperCase());
};

const compareDocumentToLawBook = ({ fullText, clauses = [], missingClauses = [], loopholes = [] }) => {
  try {
    const normalizedText = normalizeText(fullText);

    const clauseInsights = clauses.map((clause) => {
      const clauseText = normalizeText(`${clause.heading || ''} ${clause.text || ''} ${clause.type || ''}`);
      const combinedText = `${clauseText} ${normalizedText}`;

      const scoredRules = lawBook.rules
        .map((rule) => ({
          rule,
          score: scoreRuleMatch(combinedText, rule)
        }))
        .filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, MAX_REFERENCES_PER_CLAUSE);

      const lawReferences = scoredRules.flatMap((entry) => buildLawReferences(entry.rule));
      const primaryRule = scoredRules[0]?.rule || null;
      const jurisdictionWarning = primaryRule
        ? `${primaryRule.references?.[0]?.act || 'Indian contract law'}: ${primaryRule.warning}`
        : null;

      return {
        clauseId: clause.id,
        lawReferences,
        jurisdictionWarning,
        matchedRuleIds: scoredRules.map((entry) => entry.rule.id),
        matchedRuleLabels: scoredRules.map((entry) => entry.rule.label)
      };
    });

    const uniqueActs = mergeUnique(
      clauseInsights.flatMap((insight) => insight.lawReferences.map((reference) => reference.source))
    );

    const findings = [];

    const criticalMissing = missingClauses.filter((missingClause) => missingClause.importance === 'critical');
    if (criticalMissing.length > 0) {
      findings.push(
        `${criticalMissing[0].clauseType} is missing, so the deal lacks a protection that Indian contract law expects you to make explicit.`
      );
    }

    const highRiskClause = clauses
      .filter((clause) => (clause.riskScore || 0) >= 4)
      .sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0))[0];
    if (highRiskClause) {
      findings.push(
        `${highRiskClause.heading || describeClauseType(highRiskClause.type)} is one of the highest-risk clauses and should be narrowed before signing.`
      );
    }

    const exploitableLoophole = loopholes[0];
    if (exploitableLoophole) {
      findings.push(
        `${exploitableLoophole.heading} leaves room for the other party to rely on vague wording instead of a clear commitment.`
      );
    }

    if (findings.length < MAX_FINDINGS && uniqueActs.includes('Indian Contract Act, 1872')) {
      findings.push(
        'The contract should spell out performance, breach, and remedies more clearly so the Indian Contract Act, 1872 works in your favour instead of creating ambiguity.'
      );
    }

    const overview = uniqueActs.length > 0
      ? `The law book comparison matched this contract against ${uniqueActs.join(', ')} and found places where the wording should be tightened for a small business owner.`
      : 'The law book comparison did not find strong clause-to-law matches, so the contract needs a closer manual review.';

    return {
      clauseInsights,
      reviewSummary: {
        overview,
        findings: findings.slice(0, MAX_FINDINGS),
        matchedActs: uniqueActs
      }
    };
  } catch (err) {
    console.error('compareDocumentToLawBook error:', err.message);
    throw new Error('Failed to compare contract against the law book');
  }
};

module.exports = {
  compareDocumentToLawBook
};