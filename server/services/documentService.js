const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const Tesseract = require('tesseract.js');

/**
 * Extract text content from various file types
 * @param {string} filePath - Absolute path to the file
 * @returns {{ fullText: string, pageCount: number, charCount: number }}
 */
const extractText = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();

  try {
    let fullText = '';
    let pageCount = 1;

    if (ext === '.pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      fullText = data.text;
      pageCount = data.numpages || 1;
    } else if (ext === '.docx' || ext === '.doc') {
      // Note: mammoth primarily supports .docx. .doc support is limited.
      const result = await mammoth.extractRawText({ path: filePath });
      fullText = result.value;
    } else if (ext === '.txt') {
      fullText = fs.readFileSync(filePath, 'utf-8');
    } else if (ext === '.jpg' || ext === '.jpeg') {
      const { data: { text } } = await Tesseract.recognize(filePath, 'eng', {
        logger: m => {} // suppress logging
      });
      fullText = text;
    } else {
      throw new Error(`Unsupported file type: ${ext}`);
    }

    if (!fullText || fullText.trim().length === 0) {
      throw new Error(
        'Could not extract text. Ensure the file contains text or clear images.'
      );
    }

    return {
      fullText: fullText,
      pageCount: pageCount,
      charCount: fullText.length
    };
  } catch (err) {
    if (err.message.includes('Could not extract text')) {
      throw err;
    }
    throw new Error(
      `Text extraction failed for ${ext}: ${err.message}`
    );
  }
};

module.exports = { extractText };
