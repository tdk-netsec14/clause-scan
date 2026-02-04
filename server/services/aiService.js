// Unified architecture: Groq (Llama 3) handles contract analysis, summary, Hindi translation, and chat.
const Groq = require('groq-sdk');

const GROQ_MODEL = 'llama-3.3-70b-versatile';
const ANALYSIS_TEXT_LIMIT = 25000;
const CHAT_TEXT_LIMIT = 15000;

const groqClient = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const truncateText = (text, maxLength) => {
  const value = String(text || '');
  return value.length > maxLength ? value.slice(0, maxLength) : value;
};

const stripMarkdownFences = (text) => {
  const value = String(text || '').trim();

  if (value.startsWith('```')) {
    return value
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```\s*$/i, '');
  }

  return value;
};

const parseJson = (responseText) => {
  const cleaned = stripMarkdownFences(responseText);
  return JSON.parse(cleaned);
};

const isJsonParseError = (err) => {
  const message = String(err?.message || '');
  return err instanceof SyntaxError || /Unexpected token|JSON/i.test(message);
};

const callGroq = async ({ systemInstruction, prompt, maxTokens = 4096 }) => {
  if (!groqClient) {
    throw new Error('Groq API key is missing.');
  }

  return groqClient.chat.completions.create({
    model: GROQ_MODEL,
    messages: [
      { role: 'system', content: systemInstruction },
      { role: 'user', content: prompt }
    ],
    temperature: 0.2,
    max_tokens: maxTokens
  });
};

const buildAnalysisPrompt = (fullText, simplified = false) => {
  const contractText = truncateText(fullText, ANALYSIS_TEXT_LIMIT);

  if (simplified) {
    return `Read this contract and return one JSON object with these keys: clauses, missingClauses, loopholes, redFlags, negotiationPoints.

For each clause include id, heading, text, type, riskScore, riskReason, suggestedRevision, favorability, loophole, jurisdictionWarning.

Use simple plain English. Keep riskScore as a number. Use favorability only as favors_you, neutral, or favors_other_party. redFlags must have exactly 3 items. negotiationPoints must have 3 to 7 items.

Contract text:
${contractText}`;
  }

  return `Analyze the following Indian contract and return a single JSON object with exactly these keys:
{
  "clauses": [
    {
      "id": "clause_1",
      "heading": "string",
      "text": "exact text from contract",
      "type": "termination|payment|liability|arbitration|confidentiality|indemnification|governing_law|intellectual_property|other",
      "riskScore": 1,
      "riskReason": "plain English for small business owner",
      "suggestedRevision": "specific thing to negotiate",
      "favorability": "favors_you|neutral|favors_other_party",
      "loophole": null,
      "jurisdictionWarning": null
    }
  ],
  "missingClauses": [
    {
      "clauseType": "string",
      "importance": "critical|high|medium",
      "explanation": "why this matters",
      "recommendation": "what to ask the other party to add"
    }
  ],
  "loopholes": [
    {
      "heading": "string",
      "description": "what the loophole is in plain English",
      "risk": "how the other party could exploit this",
      "suggestion": "how to close this loophole"
    }
  ],
  "redFlags": ["string", "string", "string"],
  "negotiationPoints": ["string", "string", "string"]
}

Rules:
- riskScore must be a JSON number, not a string
- favorability must be exactly one of the three enum values
- redFlags must be exactly 3 items and specific to this contract
- negotiationPoints must be 3 to 7 items, ordered by importance
- missingClauses must check payment terms, payment schedule, termination notice, dispute resolution, IP ownership, confidentiality, liability cap, force majeure, governing law
- loopholes must flag vague timelines, undefined terms, unlimited discretion, and conditions with no objective criteria
- jurisdictionWarning should reference Indian Contract Act 1872, Arbitration Act 1996, or IT Act 2000 where relevant
- Return only valid JSON with no markdown and no explanation

Contract text:
${contractText}`;
};

const buildSummaryPrompt = (analysisResult) => {
  const clauses = Array.isArray(analysisResult?.clauses)
    ? [...analysisResult.clauses]
        .sort((left, right) => (right.riskScore || 0) - (left.riskScore || 0))
        .slice(0, 5)
        .map((clause) => ({
          id: clause.id,
          heading: clause.heading,
          type: clause.type,
          riskScore: clause.riskScore,
          riskReason: clause.riskReason
        }))
    : [];

  const redFlags = Array.isArray(analysisResult?.redFlags) ? analysisResult.redFlags : [];
  const missingClauses = Array.isArray(analysisResult?.missingClauses)
    ? analysisResult.missingClauses.filter((item) => ['critical', 'high'].includes(item.importance))
    : [];

  return `Write a 180-220 word summary for a small Indian business owner. Use simple language - like a knowledgeable friend explaining, not a lawyer.

Cover exactly these four points:
1. What they are agreeing to (2-3 sentences)
2. The 3 biggest risks from: ${JSON.stringify(redFlags)}
3. What important protections are missing: ${JSON.stringify(missingClauses)}
4. Two most important things to do before signing

Top risky clauses: ${JSON.stringify(clauses)}

Never use legal jargon without immediately explaining it.
Be warm, direct, and specific to this contract.`;
};

const buildHindiPrompt = (englishSummary) => {
  return `Translate this summary into conversational, everyday Hindi using the Devanagari script (हिंदी).
Write as if explaining to a shopkeeper or small trader in India.
Use natural, easy-to-understand Hindi. You may mix in common English words written in Devanagari (like 'कॉन्ट्रैक्ट' or 'पेमेंट') if it makes it easier to understand, but do NOT use formal, complex Sanskrit-derived Hindi.
CRITICAL: The entire response MUST be written in the Devanagari script. Do NOT use the Latin/English alphabet.

Return only the translated text. No English. No explanation.

Summary:
${englishSummary}`;
};

const buildAnswerPrompt = (extractedText, question) => {
  const text = truncateText(extractedText, CHAT_TEXT_LIMIT);

  return `Contract text:
${text}

Question: ${question}

Answer in 2-4 sentences. State which clause your answer comes from. If not in contract, say: 'This is not mentioned in the contract. Ask the other party to clarify this point.'`;
};

const analyzeContract = async (fullText) => {
  try {
    const systemInstruction = 'You are an expert Indian contract law analyst. Return only valid JSON matching the exact schema. No markdown. No explanation. Just the JSON object.';

    try {
      const response = await callGroq({
        systemInstruction,
        prompt: buildAnalysisPrompt(fullText, false),
        maxTokens: 4096
      });

      const responseText = response?.choices?.[0]?.message?.content || '';
      return parseJson(responseText);
    } catch (initialErr) {
      if (!isJsonParseError(initialErr)) {
        throw initialErr;
      }

      await delay(1000);

      const retryResponse = await callGroq({
        systemInstruction,
        prompt: buildAnalysisPrompt(fullText, true),
        maxTokens: 4096
      });

      try {
        const retryText = retryResponse?.choices?.[0]?.message?.content || '';
        return parseJson(retryText);
      } catch (retryErr) {
        console.error('analyzeContract failed:', retryErr.message);
        throw new Error('Analysis failed — please try again');
      }
    }
  } catch (err) {
    console.error('analyzeContract failed:', err.message);

    if (err?.status === 429 || /429|rate limit/i.test(err?.message || '')) {
      throw new Error('AI service is busy. Please wait 1 minute and try again.');
    }

    if (err.message === 'Analysis failed — please try again') {
      throw err;
    }

    throw new Error('Analysis failed — please try again');
  }
};

const generateSummary = async (analysisResult) => {
  try {
    const response = await callGroq({
      systemInstruction: 'You are a helpful assistant who writes clear contract summaries for small business owners.',
      prompt: buildSummaryPrompt(analysisResult),
      maxTokens: 1024
    });

    const text = response?.choices?.[0]?.message?.content || '';
    return text.trim();
  } catch (err) {
    console.error('generateSummary failed:', err.message);

    if (err?.status === 429 || /429|rate limit/i.test(err?.message || '')) {
      throw new Error('AI service is busy. Please wait 1 minute and try again.');
    }

    throw new Error('Failed to generate summary');
  }
};

const translateToHindi = async (englishSummary) => {
  try {
    const response = await callGroq({
      systemInstruction: 'You are a helpful translator who writes natural Hindi for Indian business users.',
      prompt: buildHindiPrompt(englishSummary),
      maxTokens: 1024
    });

    const text = response?.choices?.[0]?.message?.content || '';
    return text.trim();
  } catch (err) {
    console.error('translateToHindi failed:', err.message);

    if (err?.status === 429 || /429|rate limit/i.test(err?.message || '')) {
      throw new Error('AI service is busy. Please wait 1 minute and try again.');
    }

    throw new Error('Failed to translate to Hindi');
  }
};

const calculateHealthScore = (clauses, missingClauses, loopholes) => {
  try {
    let score = 100;

    for (const clause of clauses || []) {
      switch (Number(clause?.riskScore)) {
        case 5:
          score -= 5;
          break;
        case 4:
          score -= 3;
          break;
        case 3:
          score -= 1;
          break;
        case 2:
          score -= 0;
          break;
        default:
          break;
      }
    }

    for (const missingClause of missingClauses || []) {
      switch (missingClause?.importance) {
        case 'critical':
          score -= 5;
          break;
        case 'high':
          score -= 3;
          break;
        case 'medium':
          score -= 1;
          break;
        default:
          break;
      }
    }

    score -= (loopholes || []).length * 2;

    const finalScore = Math.max(0, Math.min(100, score));

    let grade = 'F';
    let label = 'Critical Risk';

    if (finalScore >= 90) {
      grade = 'A';
      label = 'Excellent';
    } else if (finalScore >= 75) {
      grade = 'B';
      label = 'Good';
    } else if (finalScore >= 60) {
      grade = 'C';
      label = 'Fair';
    } else if (finalScore >= 45) {
      grade = 'D';
      label = 'Poor';
    }

    return { grade, percentage: finalScore, label };
  } catch (err) {
    console.error('calculateHealthScore failed:', err.message);
    throw new Error('Failed to calculate health score');
  }
};

const answerQuestion = async (extractedText, question) => {
  try {
    const response = await callGroq({
      systemInstruction: 'You are a helpful legal assistant. Answer using ONLY the contract text provided. Never invent information not in the contract. Be concise and clear.',
      prompt: buildAnswerPrompt(extractedText, question),
      maxTokens: 512
    });

    const answer = response?.choices?.[0]?.message?.content || '';
    return {
      answer: String(answer).trim(),
      sourceHint: 'Found in contract'
    };
  } catch (err) {
    console.error('answerQuestion failed:', err.message);

    if (err?.status === 429 || /429|rate limit/i.test(err?.message || '')) {
      throw new Error('Chat service is busy. Try again shortly.');
    }

    throw new Error('Failed to answer question');
  }
};

module.exports = {
  analyzeContract,
  generateSummary,
  translateToHindi,
  calculateHealthScore,
  answerQuestion
};