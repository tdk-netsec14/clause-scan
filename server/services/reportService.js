// Report service — generates professional, structured PDF analysis reports using PDFKit
const PDFDocument = require('pdfkit');

const COLORS = {
  brand: '#3B4BF9',
  brandDark: '#222CB5',
  lime: '#D4F94E',
  dark: '#1F2937',
  gray: '#6B7280',
  lightGray: '#9CA3AF',
  veryLightGray: '#E5E7EB',
  red: '#DC2626',
  green: '#16A34A',
  amber: '#D97706',
  orange: '#EA580C',
  white: '#FFFFFF',
  bgLight: '#F9FAFB',
  bgBrand: '#EEF0FF'
};

const RISK_COLORS = { 1: '#16A34A', 2: '#16A34A', 3: '#D97706', 4: '#EA580C', 5: '#DC2626' };
const RISK_LABELS = { 1: 'Safe', 2: 'Low', 3: 'Medium', 4: 'High', 5: 'Critical' };
const GRADE_COLORS = { 'A': '#16A34A', 'B': '#0D9488', 'C': '#D97706', 'D': '#EA580C', 'F': '#DC2626' };

const PAGE_WIDTH = 495; // A4 usable width with 50px margins

// ── Helper: Draw a horizontal separator line ──
const drawSeparator = (pdf, y) => {
  pdf.moveTo(50, y).lineTo(545, y).strokeColor(COLORS.veryLightGray).lineWidth(1).stroke();
};

// ── Helper: Draw section header with blue bar ──
const drawSectionHeader = (pdf, title, sectionNum) => {
  if (pdf.y > 680) pdf.addPage();

  const y = pdf.y;
  // Blue bar
  pdf.rect(50, y, 4, 28).fill(COLORS.brand);

  pdf.font('Helvetica-Bold')
    .fontSize(16)
    .fillColor(COLORS.brand)
    .text(`Section ${sectionNum}  —  ${title}`, 62, y + 6);
  
  pdf.x = 50;
  pdf.y = y + 40;
};

// ── Helper: Draw page footer ──
const drawPageFooters = (pdf) => {
  const pages = pdf.bufferedPageRange();
  for (let i = 0; i < pages.count; i++) {
    pdf.switchToPage(pages.start + i);

    // Header line
    pdf.save();
    pdf.moveTo(50, 40).lineTo(545, 40).strokeColor(COLORS.veryLightGray).lineWidth(0.5).stroke();
    pdf.font('Helvetica').fontSize(8).fillColor(COLORS.lightGray)
      .text('ClauseScan — Contract Risk Analysis Report', 50, 28, { width: PAGE_WIDTH, align: 'left' });
    pdf.restore();

    // Footer
    pdf.save();
    pdf.moveTo(50, 782).lineTo(545, 782).strokeColor(COLORS.veryLightGray).lineWidth(0.5).stroke();
    pdf.font('Helvetica').fontSize(8).fillColor(COLORS.lightGray)
      .text(`Page ${i + 1} of ${pages.count}`, 50, 790, { width: PAGE_WIDTH, align: 'center' });
    pdf.restore();
  }
};

/**
 * Generate a professional contract analysis PDF report
 * @param {Object} doc - The document from MongoDB
 * @param {Object} res - Express response object
 */
const generateReport = (doc, res) => {
  const pdf = new PDFDocument({
    size: 'A4',
    margins: { top: 60, bottom: 60, left: 50, right: 50 },
    bufferPages: true
  });

  const safeName = (doc.originalName || 'document').replace(/\.pdf$/i, '').replace(/[^a-zA-Z0-9_\-\s]/g, '');
  const filename = `ClauseScan_Report_${safeName}.pdf`;

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  pdf.pipe(res);

  // ════════════════════════════════════════════
  //  PAGE 1: Cover Page
  // ════════════════════════════════════════════
  pdf.moveDown(3);

  // Brand accent bar
  const titleStartY = pdf.y;
  pdf.rect(50, titleStartY, PAGE_WIDTH, 4).fill(COLORS.brand);
  pdf.y = titleStartY + 25;

  pdf.font('Helvetica-Bold')
    .fontSize(32)
    .fillColor(COLORS.brand)
    .text('Contract Risk', { align: 'center' })
    .text('Analysis Report', { align: 'center' });

  pdf.moveDown(0.5);
  pdf.font('Helvetica')
    .fontSize(13)
    .fillColor(COLORS.gray)
    .text('ClauseScan — AI-powered contract analysis for Indian businesses', { align: 'center' });

  pdf.moveDown(2);

  // Document info box
  const infoY = pdf.y;
  pdf.rect(120, infoY, 355, 80).fillAndStroke(COLORS.bgLight, COLORS.veryLightGray);

  pdf.font('Helvetica-Bold').fontSize(11).fillColor(COLORS.dark);
  pdf.text(`Document:  ${doc.originalName}`, 140, infoY + 12);
  pdf.font('Helvetica').fillColor(COLORS.gray);
  pdf.text(`Date Analyzed:  ${new Date(doc.createdAt).toLocaleDateString('en-IN')}`, 140, infoY + 32);
  pdf.text(`Pages:  ${doc.pageCount || 'N/A'}`, 140, infoY + 52);

  pdf.x = 50;
  pdf.y = infoY + 100;
  pdf.moveDown(1.5);

  // Health Score
  if (doc.healthScore) {
    const gradeColor = GRADE_COLORS[doc.healthScore.grade] || COLORS.gray;

    // Score box
    const scoreY = pdf.y;
    pdf.rect(170, scoreY, 255, 140).fillAndStroke(COLORS.bgBrand, COLORS.brand);

    pdf.font('Helvetica').fontSize(10).fillColor(COLORS.gray)
      .text('CONTRACT HEALTH SCORE', 170, scoreY + 12, { width: 255, align: 'center' });

    pdf.font('Helvetica-Bold').fontSize(64).fillColor(gradeColor)
      .text(doc.healthScore.grade, 170, scoreY + 28, { width: 255, align: 'center' });

    pdf.font('Helvetica-Bold').fontSize(20).fillColor(COLORS.dark)
      .text(`${doc.healthScore.percentage}%`, 170, scoreY + 95, { width: 255, align: 'center' });

    pdf.font('Helvetica').fontSize(12).fillColor(gradeColor)
      .text(doc.healthScore.label, 170, scoreY + 118, { width: 255, align: 'center' });

    pdf.x = 50;
    pdf.y = scoreY + 155;
  }

  // ════════════════════════════════════════════
  //  PAGE 2: Table of Contents
  // ════════════════════════════════════════════
  pdf.addPage();
  let sectionNum = 0;

  pdf.font('Helvetica-Bold').fontSize(22).fillColor(COLORS.brand)
    .text('Table of Contents', { underline: false });
  pdf.moveDown(1);
  drawSeparator(pdf, pdf.y);
  pdf.moveDown(0.8);

  const tocItems = [];
  if (doc.redFlags && doc.redFlags.length > 0) tocItems.push('Critical Red Flags');
  if (doc.summary && doc.summary.english) tocItems.push('Contract Summary');
  if (doc.lawReview && (doc.lawReview.overview || (doc.lawReview.findings && doc.lawReview.findings.length > 0))) tocItems.push('Law Book Comparison');
  if (doc.missingClauses && doc.missingClauses.length > 0) tocItems.push('Missing Protections');
  if (doc.loopholes && doc.loopholes.length > 0) tocItems.push('Loopholes Detected');
  if (doc.negotiationPoints && doc.negotiationPoints.length > 0) tocItems.push('Negotiation Checklist');
  if (doc.clauses && doc.clauses.length > 0) tocItems.push('Detailed Clause Analysis');

  tocItems.forEach((item, i) => {
    pdf.font('Helvetica-Bold').fontSize(12).fillColor(COLORS.dark)
      .text(`Section ${i + 1}   -   ${item}`, { indent: 20 });
    pdf.moveDown(0.3);
  });

  // ════════════════════════════════════════════
  //  Red Flags
  // ════════════════════════════════════════════
  if (doc.redFlags && doc.redFlags.length > 0) {
    pdf.addPage();
    sectionNum++;
    drawSectionHeader(pdf, 'Critical Red Flags', sectionNum);

    pdf.font('Helvetica').fontSize(10).fillColor(COLORS.gray)
      .text('Critical issues that need immediate attention or negotiation before signing.', { lineGap: 2 });
    pdf.moveDown(1);

    doc.redFlags.forEach((flag, index) => {
      if (pdf.y > 700) pdf.addPage();

      const y = pdf.y;
      pdf.circle(62, y + 7, 4).fill(COLORS.red);

      pdf.font('Helvetica-Bold').fontSize(11).fillColor(COLORS.dark)
        .text(`${index + 1}. ${flag}`, 75, y, { lineGap: 3, width: PAGE_WIDTH - 25 });
      
      pdf.x = 50;
      pdf.moveDown(0.8);
    });
  }

  // ════════════════════════════════════════════
  //  Summary
  // ════════════════════════════════════════════
  if (doc.summary && doc.summary.english) {
    pdf.addPage();
    sectionNum++;
    drawSectionHeader(pdf, 'Contract Summary', sectionNum);

    pdf.font('Helvetica').fontSize(10).fillColor(COLORS.gray)
      .text('What this contract means for you, explained in plain English.', { lineGap: 2 });
    pdf.moveDown(1);

    // Summary in a highlighted box
    const sumY = pdf.y;
    const sumText = doc.summary.english;

    // Measure text height
    const sumHeight = pdf.heightOfString(sumText, { width: PAGE_WIDTH - 40, fontSize: 11, lineGap: 4 }) + 24;

    if (sumY + sumHeight > 750) pdf.addPage();

    pdf.rect(50, pdf.y, PAGE_WIDTH, sumHeight).fill(COLORS.bgLight);
    pdf.rect(50, pdf.y, 3, sumHeight).fill(COLORS.brand);

    pdf.font('Helvetica').fontSize(11).fillColor(COLORS.dark)
      .text(sumText, 70, pdf.y + 12, { width: PAGE_WIDTH - 40, lineGap: 4 });

    pdf.x = 50;
    pdf.y = pdf.y + 10;
  }

  // ════════════════════════════════════════════
  //  Law Book Review
  // ════════════════════════════════════════════
  if (doc.lawReview && (doc.lawReview.overview || (doc.lawReview.findings && doc.lawReview.findings.length > 0))) {
    pdf.addPage();
    sectionNum++;
    drawSectionHeader(pdf, 'Law Book Comparison', sectionNum);

    if (doc.lawReview.overview) {
      pdf.font('Helvetica').fontSize(11).fillColor(COLORS.dark)
        .text(doc.lawReview.overview, { lineGap: 4 });
      pdf.moveDown(1);
    }

    if (doc.lawReview.matchedActs && doc.lawReview.matchedActs.length > 0) {
      pdf.font('Helvetica-Bold').fontSize(10).fillColor(COLORS.gray)
        .text('Matched Laws:');
      pdf.font('Helvetica').fontSize(10).fillColor(COLORS.brand)
        .text(doc.lawReview.matchedActs.join('  |  '));
      pdf.moveDown(1);
    }

    if (doc.lawReview.findings && doc.lawReview.findings.length > 0) {
      drawSeparator(pdf, pdf.y);
      pdf.moveDown(0.8);

      doc.lawReview.findings.forEach((finding, index) => {
        if (pdf.y > 700) pdf.addPage();
        pdf.font('Helvetica').fontSize(11).fillColor(COLORS.dark)
          .text(`${index + 1}. ${finding}`, { indent: 18, lineGap: 3 });
        pdf.moveDown(0.6);
      });
    }
  }

  // ════════════════════════════════════════════
  //  Missing Clauses
  // ════════════════════════════════════════════
  if (doc.missingClauses && doc.missingClauses.length > 0) {
    pdf.addPage();
    sectionNum++;
    drawSectionHeader(pdf, 'Missing Protections', sectionNum);

    pdf.font('Helvetica').fontSize(10).fillColor(COLORS.gray)
      .text('These clauses are important for protecting your interests. Request them in writing.', { lineGap: 2 });
    pdf.moveDown(1);

    doc.missingClauses.forEach((missing) => {
      if (pdf.y > 680) pdf.addPage();

      const importanceColor = missing.importance === 'critical' ? COLORS.red :
                              missing.importance === 'high' ? COLORS.orange : COLORS.amber;

      pdf.font('Helvetica-Bold').fontSize(11).fillColor(COLORS.dark)
        .text(`- ${missing.clauseType}  [${(missing.importance || 'medium').toUpperCase()}]`, { indent: 15 });

      pdf.font('Helvetica').fontSize(10).fillColor(COLORS.gray)
        .text(missing.explanation, { indent: 25, lineGap: 2 });
      
      pdf.moveDown(0.3);

      pdf.font('Helvetica-Bold').fontSize(10).fillColor(COLORS.green)
        .text('Recommendation:', { indent: 25 });
      pdf.font('Helvetica').fontSize(10).fillColor(COLORS.dark)
        .text(missing.recommendation, { indent: 25, lineGap: 2 });

      pdf.moveDown(0.8);
      drawSeparator(pdf, pdf.y - 4);
      pdf.moveDown(0.4);
    });
  }

  // ════════════════════════════════════════════
  //  Loopholes
  // ════════════════════════════════════════════
  if (doc.loopholes && doc.loopholes.length > 0) {
    pdf.addPage();
    sectionNum++;
    drawSectionHeader(pdf, 'Loopholes Detected', sectionNum);

    pdf.font('Helvetica').fontSize(10).fillColor(COLORS.gray)
      .text('Vague or exploitable terms that could be used against you.', { lineGap: 2 });
    pdf.moveDown(1);

    doc.loopholes.forEach((loophole) => {
      if (pdf.y > 660) pdf.addPage();

      pdf.font('Helvetica-Bold').fontSize(11).fillColor(COLORS.orange)
        .text(`[!] ${loophole.heading}`, { indent: 15 });

      pdf.font('Helvetica').fontSize(10).fillColor(COLORS.dark)
        .text(loophole.description, { indent: 25, lineGap: 2 });
      
      pdf.moveDown(0.3);

      pdf.font('Helvetica-Bold').fontSize(10).fillColor(COLORS.red)
        .text('Risk:', { indent: 25 });
      pdf.font('Helvetica').fontSize(10).fillColor(COLORS.dark)
        .text(loophole.risk, { indent: 25, lineGap: 2 });

      pdf.moveDown(0.3);

      pdf.font('Helvetica-Bold').fontSize(10).fillColor(COLORS.green)
        .text('Fix:', { indent: 25 });
      pdf.font('Helvetica').fontSize(10).fillColor(COLORS.dark)
        .text(loophole.suggestion, { indent: 25, lineGap: 2 });

      pdf.moveDown(0.8);
      drawSeparator(pdf, pdf.y - 4);
      pdf.moveDown(0.4);
    });
  }

  // ════════════════════════════════════════════
  //  Negotiation Checklist
  // ════════════════════════════════════════════
  if (doc.negotiationPoints && doc.negotiationPoints.length > 0) {
    pdf.addPage();
    sectionNum++;
    drawSectionHeader(pdf, 'Negotiation Checklist', sectionNum);

    pdf.font('Helvetica').fontSize(10).fillColor(COLORS.gray)
      .text('Use this checklist when negotiating with the other party before signing.', { lineGap: 2 });
    pdf.moveDown(1);

    doc.negotiationPoints.forEach((point, index) => {
      if (pdf.y > 720) pdf.addPage();

      pdf.font('Helvetica-Bold').fontSize(11).fillColor(COLORS.brand)
        .text(`[ ] ${index + 1}. ${point}`, { indent: 20, lineGap: 3 });

      pdf.moveDown(0.6);
    });
  }

  // ════════════════════════════════════════════
  //  Detailed Clause Analysis
  // ════════════════════════════════════════════
  if (doc.clauses && doc.clauses.length > 0) {
    pdf.addPage();
    sectionNum++;
    drawSectionHeader(pdf, 'Detailed Clause Analysis', sectionNum);

    pdf.font('Helvetica').fontSize(10).fillColor(COLORS.gray)
      .text(`${doc.clauses.length} clauses analyzed, sorted by risk level (highest first).`, { lineGap: 2 });
    pdf.moveDown(1);

    const sorted = [...doc.clauses].sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0));

    sorted.forEach((clause, idx) => {
      if (pdf.y > 640) pdf.addPage();

      const riskColor = RISK_COLORS[clause.riskScore] || COLORS.gray;
      const riskLabel = RISK_LABELS[clause.riskScore] || 'Unknown';

      // Clause header row
      const headerY = pdf.y;
      pdf.rect(50, headerY, PAGE_WIDTH, 22).fill(idx % 2 === 0 ? COLORS.bgLight : COLORS.white);
      pdf.rect(50, headerY, 3, 22).fill(riskColor);

      const headerText = `${clause.heading || `Clause ${idx + 1}`}   |   [${riskLabel} ${clause.riskScore}/5]   |   ${(clause.type || 'other').replace(/_/g, ' ')}`;
      pdf.font('Helvetica-Bold').fontSize(10).fillColor(COLORS.dark)
        .text(headerText, 60, headerY + 6);
      
      pdf.x = 50;
      pdf.y = headerY + 30;

      // Risk reason
      pdf.font('Helvetica').fontSize(10).fillColor(COLORS.gray)
        .text(clause.riskReason || '', { indent: 15, lineGap: 2 });
      
      pdf.moveDown(0.3);

      // Suggested revision
      if (clause.suggestedRevision) {
        pdf.font('Helvetica-Bold').fontSize(9).fillColor(COLORS.green)
          .text('Suggested:', { indent: 15 });
        pdf.font('Helvetica').fontSize(9).fillColor(COLORS.dark)
          .text(clause.suggestedRevision, { indent: 15, lineGap: 2 });
        pdf.moveDown(0.3);
      }

      // Loophole
      if (clause.loophole) {
        pdf.font('Helvetica-Bold').fontSize(9).fillColor(COLORS.orange)
          .text('Loophole:', { indent: 15 });
        pdf.font('Helvetica').fontSize(9).fillColor(COLORS.dark)
          .text(clause.loophole, { indent: 15, lineGap: 2 });
        pdf.moveDown(0.3);
      }

      // Jurisdiction warning
      if (clause.jurisdictionWarning) {
        pdf.font('Helvetica-Bold').fontSize(9).fillColor(COLORS.brand)
          .text('Jurisdiction:', { indent: 15 });
        pdf.font('Helvetica').fontSize(9).fillColor(COLORS.dark)
          .text(clause.jurisdictionWarning, { indent: 15, lineGap: 2 });
        pdf.moveDown(0.3);
      }

      // Law references
      if (clause.lawReferences && clause.lawReferences.length > 0) {
        clause.lawReferences.forEach((reference) => {
          pdf.font('Helvetica-Bold').fontSize(9).fillColor(COLORS.gray)
            .text(`Law: ${reference.source} - ${reference.section}`, { indent: 15, lineGap: 1 });
          if (reference.note) {
            pdf.font('Helvetica').fontSize(8).fillColor(COLORS.lightGray)
              .text(reference.note, { indent: 15, lineGap: 2 });
          }
        });
        pdf.moveDown(0.3);
      }

      pdf.moveDown(0.8);
    });
  }

  // ════════════════════════════════════════════
  //  LAST PAGE: Disclaimer
  // ════════════════════════════════════════════
  pdf.addPage();
  pdf.moveDown(6);

  drawSeparator(pdf, pdf.y);
  pdf.moveDown(1);

  pdf.font('Helvetica-Bold').fontSize(12).fillColor(COLORS.brand)
    .text('Disclaimer', { align: 'center' });
  pdf.moveDown(0.5);

  pdf.fontSize(9)
    .font('Helvetica')
    .fillColor(COLORS.lightGray)
    .text(
      'This report was generated by ClauseScan using artificial intelligence and is provided for informational purposes only. It does not constitute legal advice and should not be relied upon as such. Laws and regulations vary by jurisdiction and circumstance. Always consult a qualified lawyer licensed in India before signing any contract.',
      { align: 'center', lineGap: 3 }
    );

  pdf.moveDown(1.5);
  drawSeparator(pdf, pdf.y);
  pdf.moveDown(0.5);

  pdf.fontSize(9)
    .fillColor(COLORS.lightGray)
    .text(`Generated on ${new Date().toLocaleDateString('en-IN')} by ClauseScan Enterprise Suite`, { align: 'center' });

  // ── Draw headers & footers on all pages ──
  drawPageFooters(pdf);

  pdf.end();
};

module.exports = { generateReport };
