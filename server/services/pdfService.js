// PDF service — extracts text content from uploaded PDF files
const fs = require('fs');
const pdfParse = require('pdf-parse');

/**
 * Extract text content from a PDF file
 * @param {string} filePath - Absolute path to the PDF file
 * @returns {{ fullText: string, pageCount: number, charCount: number }}
 */
const extractText = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);

    if (!data.text || data.text.trim().length === 0) {
      throw new Error(
        'Could not extract text. Ensure the PDF contains selectable text, not scanned images.'
      );
    }

    return {
      fullText: data.text,
      pageCount: data.numpages,
      charCount: data.text.length
    };
  } catch (err) {
    if (err.message.includes('Could not extract text')) {
      throw err;
    }
    throw new Error(
      'Could not extract text. Ensure the PDF contains selectable text, not scanned images.'
    );
  }
};

module.exports = { extractText };
