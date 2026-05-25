# ClauseScan

## AI-Powered Contract Intelligence for Indian Businesses

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square\&logo=nodedotjs\&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square\&logo=react\&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.0-47A248?style=flat-square\&logo=mongodb\&logoColor=white)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

ClauseScan is an AI-powered contract analysis platform designed for Indian businesses, freelancers, and MSMEs. The platform analyzes legal contracts, identifies risks, loopholes, and missing protections, and maps findings against Indian contract law to help users make informed decisions without requiring expensive legal consultation.

---

# Overview

Small and medium-sized businesses often sign contracts without legal review due to high consultation costs and limited access to legal expertise. ClauseScan addresses this problem by providing automated contract intelligence in under a minute.

Users can upload contracts in multiple formats and receive:

* Clause-by-clause analysis
* Risk scoring
* Missing clause detection
* Indian law references
* Negotiation recommendations
* English and Hindi summaries
* AI-powered contract Q&A
* Downloadable PDF reports

---

# Key Features

## Contract Analysis

* Clause-level extraction and categorization
* Risk scoring on a scale of 1–5
* Favorability assessment for each clause
* Suggested revisions for risky terms
* Jurisdiction and governing law warnings

## Risk Intelligence

* Health score grading system from A to F
* Red flag identification
* Loophole detection with mitigation suggestions
* Missing clause analysis with severity levels

## Indian Law Compliance

ClauseScan cross-references contracts against major Indian legal frameworks, including:

* Indian Contract Act, 1872
* Arbitration and Conciliation Act, 1996
* Copyright Act, 1957

The platform also provides section-level legal references where applicable.

## Bilingual Summaries

* Plain-English executive summaries
* Conversational Hindi translations in Devanagari script
* Simplified explanations for non-technical users

## AI Contract Chatbot

Users can ask natural-language questions about uploaded contracts and receive grounded answers based only on the contract content.

## PDF Report Generation

Generate professional multi-page reports containing:

* Contract health score
* Clause analysis
* Legal references
* Negotiation recommendations
* Risk summaries

## Multi-Format Upload Support

Supported file types:

* PDF
* DOCX
* TXT
* JPG / JPEG

Scanned image contracts are processed using OCR through Tesseract.js.

---

# System Architecture

```text
Client (React 19)
        │
        ▼
Express.js API Server
        │
        ├── Authentication Layer
        ├── Document Processing Layer
        ├── AI Analysis Service
        ├── Law Review Engine
        └── Report Generation Service
        │
        ├── MongoDB Database
        └── Groq API (Llama 3.3 70B)
```

---

# Technology Stack

| Layer           | Technology                       | Purpose                             |
| --------------- | -------------------------------- | ----------------------------------- |
| Frontend        | React 19, React Router 6         | Single-page application             |
| Styling         | Tailwind CSS, Framer Motion      | UI design and animations            |
| Backend         | Node.js, Express.js              | REST API server                     |
| AI Engine       | Groq SDK with Llama 3.3 70B      | Contract analysis and Q&A           |
| Database        | MongoDB with Mongoose            | Data storage and schema management  |
| Authentication  | JWT and bcrypt                   | Stateless authentication            |
| File Processing | pdf-parse, Mammoth, Tesseract.js | Text extraction and OCR             |
| Reporting       | PDFKit                           | PDF report generation               |
| Security        | express-rate-limit, CORS         | API protection and request security |

---

# Getting Started

## Prerequisites

Before running the project, ensure the following are installed:

* Node.js 18 or later
* MongoDB local instance or MongoDB Atlas
* Groq API key

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/tdk-netsec14/clause-scan.git
cd clause-scan
```

### 2. Install Dependencies

```bash
npm run install-all
```

### 3. Configure Environment Variables

Create the environment file:

```bash
cp server/.env.example server/.env
```

Update the file with your credentials:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/clausescan
JWT_SECRET=your-secure-secret-key
GROQ_API_KEY=your-groq-api-key
```

### 4. Start the Development Server

```bash
npm run dev
```

Services:

| Service      | URL                                                                  |
| ------------ | -------------------------------------------------------------------- |
| Frontend     | [http://localhost:3000](http://localhost:3000)                       |
| Backend API  | [http://localhost:5000](http://localhost:5000)                       |
| Health Check | [http://localhost:5000/api/health](http://localhost:5000/api/health) |

---

# API Reference

## Authentication Endpoints

| Method | Endpoint             | Description                  |
| ------ | -------------------- | ---------------------------- |
| POST   | `/api/auth/register` | Register a new user          |
| POST   | `/api/auth/login`    | Authenticate and receive JWT |

## Document Endpoints

| Method | Endpoint                    | Description                 |
| ------ | --------------------------- | --------------------------- |
| POST   | `/api/documents/upload`     | Upload a contract           |
| GET    | `/api/documents`            | Retrieve all user documents |
| GET    | `/api/documents/:id`        | Retrieve analyzed document  |
| GET    | `/api/documents/:id/report` | Download PDF report         |
| DELETE | `/api/documents/:id`        | Delete a document           |

## Analysis Endpoints

| Method | Endpoint               | Description                    |
| ------ | ---------------------- | ------------------------------ |
| POST   | `/api/analysis/:docId` | Trigger AI analysis            |
| POST   | `/api/query/:docId`    | Ask questions about a contract |

All protected endpoints require:

```http
Authorization: Bearer <token>
```

---

# Project Structure

```text
clause-scan/
├── package.json
├── server/
│   ├── index.js
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── data/
│   └── uploads/
│
└── client/
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   ├── context/
    │   ├── services/
    │   └── utils/
    ├── public/
    └── tailwind.config.js
```

---

# Security Features

| Feature          | Implementation                         |
| ---------------- | -------------------------------------- |
| Password Hashing | bcrypt with 10 salt rounds             |
| Authentication   | JWT with 7-day expiration              |
| Rate Limiting    | Upload and query rate limits           |
| Input Validation | Server-side validation on all requests |
| Access Control   | Document ownership verification        |
| Error Handling   | Sanitized production error responses   |
| File Validation  | MIME type and extension validation     |

---

# Performance Optimizations

* Asynchronous background analysis pipeline
* Optimistic UI updates during uploads and analysis
* Groq low-latency inference for fast AI responses
* MongoDB query optimization using selective field loading
* Streaming PDF generation to reduce memory overhead
* OCR fallback for scanned contracts

---

# Development Challenges

## AI JSON Parsing

Structured AI responses occasionally returned malformed JSON. A fallback parsing and retry mechanism was implemented to improve reliability.

## OCR Processing

Scanned PDFs and image-based contracts required OCR integration using Tesseract.js to support real-world contract formats.

## Hindi Translation Quality

Translation prompts were refined to produce conversational Hindi suitable for non-technical users instead of overly formal language.

## Database Startup Reliability

MongoDB connection retry logic and readiness checks were implemented to prevent startup failures.

---

# Roadmap

Planned future enhancements include:

* Google OAuth integration
* Bulk contract comparison
* Clause template recommendations
* Team collaboration features
* Additional Indian language support
* Vector search and semantic clause retrieval
* Enterprise deployment options
* Self-hosted AI model support

---

# Contributing

Contributions are welcome.

To contribute:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push the branch
5. Open a pull request

Please follow the existing code structure and include proper error handling and documentation.

---

# License

This project is licensed under the MIT License.

See the `LICENSE` file for additional information.

---

# Author

Developed as an AI-powered legal technology platform focused on improving contract accessibility for Indian businesses and MSMEs.

---

# Closing Note

ClauseScan aims to make legal contract understanding accessible, affordable, and practical for every business owner.

Legal clarity should not depend on access to expensive legal services.
