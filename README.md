<![CDATA[<div align="center">

# ⚖️ ClauseScan

### AI-Powered Contract Intelligence for Indian Businesses

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Llama 3.3](https://img.shields.io/badge/Llama_3.3-70B-7C3AED?style=for-the-badge&logo=meta&logoColor=white)](https://groq.com/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

**ClauseScan** analyzes legal contracts using AI, identifies risks, loopholes, and missing protections — then maps them against **Indian contract law** — so small business owners can negotiate with confidence, without expensive legal teams.

[Getting Started](#-getting-started) · [Features](#-features) · [Architecture](#-architecture) · [API Reference](#-api-reference) · [Contributing](#-contributing)

</div>

---

## 🎯 The Problem

Over **90% of Indian SMBs** sign contracts without legal review. Hidden clauses, missing protections, and one-sided terms silently erode business value. Legal counsel costs ₹5,000–₹50,000 per review — out of reach for most small businesses.

**ClauseScan** changes that. Upload a contract, get a full AI-powered legal analysis in under 60 seconds — in **English and Hindi**.

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🔍 Deep Contract Analysis
- Clause-by-clause extraction with **risk scoring (1–5)**
- Favorability assessment per clause
- Jurisdiction & governing law warnings
- Suggested revisions for risky language

### 🛡️ Risk Intelligence
- **Health Score Grading** — A through F with percentage
- **Red Flag Detection** — Top 3 critical issues surfaced
- **Loophole Detection** — With risk context & fix suggestions
- **Missing Clause Alerts** — Critical, High, Medium severity

### 📖 Indian Law Compliance
- Automated review against **9 legal rules** covering:
  - Indian Contract Act, 1872
  - Arbitration & Conciliation Act, 1996
  - Copyright Act, 1957
- Section-level citations (e.g., Sections 37, 39, 55, 73, 74)

</td>
<td width="50%">

### 🌐 Bilingual Summaries
- Executive summary in plain **English**
- Full translation to conversational **Hindi (Devanagari)**
- Designed for non-legal, non-English-speaking stakeholders

### 💬 AI Contract Chatbot
- Ask natural language questions about your contract
- Get 2–4 sentence answers citing specific clauses
- Rate-limited to 30 queries/hour per user

### 📄 Professional PDF Reports
- Multi-page branded reports via PDFKit
- Includes: cover page, ToC, health gauge, clause details, law comparison, negotiation checklist, and disclaimer
- Color-coded risk badges and page-numbered sections

### 📁 Multi-Format Upload
- **PDF** — Native text extraction
- **DOCX** — Full document parsing
- **TXT** — Plain text ingestion
- **JPG/JPEG** — OCR via Tesseract.js

</td>
</tr>
</table>

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (React 19)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────────┐  │
│  │ Landing  │  │  Auth    │  │Dashboard │  │   Analysis     │  │
│  │  Page    │  │  Pages   │  │  Page    │  │    Page        │  │
│  └──────────┘  └──────────┘  └──────────┘  └────────────────┘  │
│       Tailwind CSS • Framer Motion • Axios • React Router       │
└────────────────────────────┬────────────────────────────────────┘
                             │ REST API (HTTP)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SERVER (Express.js)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │  Auth    │  │ Document │  │ Analysis │  │   Query      │   │
│  │ Routes   │  │  Routes  │  │  Routes  │  │   Routes     │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────┬───────┘   │
│       │              │             │               │            │
│  ┌────▼─────┐  ┌─────▼────┐  ┌────▼──────┐  ┌─────▼──────┐   │
│  │JWT Auth  │  │Doc Svc   │  │AI Service │  │AI Service  │   │
│  │Middleware│  │PDF/DOCX/ │  │LawBook Svc│  │(Q&A Mode)  │   │
│  │          │  │TXT/OCR   │  │Report Svc │  │            │   │
│  └──────────┘  └──────────┘  └───────────┘  └────────────┘   │
└────────────────────┬──────────────────┬─────────────────────────┘
                     │                  │
              ┌──────▼──────┐    ┌──────▼──────┐
              │  MongoDB    │    │  Groq API   │
              │  (Mongoose) │    │ Llama 3.3   │
              │             │    │    70B      │
              └─────────────┘    └─────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|:------|:-----------|:--------|
| **Frontend** | React 19, React Router 6 | SPA with protected routing |
| **Styling** | Tailwind CSS 3.4, Framer Motion | Utility-first CSS + animations |
| **UI Components** | Lucide React, React Dropzone, React Hot Toast | Icons, file upload UX, notifications |
| **Backend** | Node.js, Express.js 4 | REST API server |
| **AI Engine** | Groq SDK → Llama 3.3 70B Versatile | Contract analysis, summaries, translation, Q&A |
| **Database** | MongoDB via Mongoose 8 | Document storage, user management |
| **Auth** | JWT + bcrypt | Stateless authentication (7-day tokens) |
| **File Processing** | pdf-parse, Mammoth, Tesseract.js | PDF, DOCX, and OCR text extraction |
| **PDF Reports** | PDFKit | Professional multi-page report generation |
| **Security** | express-rate-limit, CORS, Helmet-ready | Rate limiting & request security |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **MongoDB** — Local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier works)
- **Groq API Key** — Get one free at [console.groq.com](https://console.groq.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/tdk-netsec14/clause-scan.git
cd clause-scan
```

### 2. Install Dependencies

```bash
# Install all dependencies (root + server + client)
npm run install-all
```

### 3. Configure Environment

```bash
cp server/.env.example server/.env
```

Edit `server/.env` with your credentials:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/clausescan
JWT_SECRET=your-secure-random-secret-key
GROQ_API_KEY=gsk_your_groq_api_key_here
```

### 4. Launch Development Server

```bash
npm run dev
```

This starts both servers concurrently:

| Service | URL |
|:--------|:----|
| Client (React) | `http://localhost:3000` |
| Server (API) | `http://localhost:5000` |
| Health Check | `http://localhost:5000/api/health` |

---

## 📡 API Reference

### Authentication

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `POST` | `/api/auth/register` | Create account → returns JWT |
| `POST` | `/api/auth/login` | Login → returns JWT |

### Documents

| Method | Endpoint | Rate Limit | Description |
|:-------|:---------|:-----------|:------------|
| `POST` | `/api/documents/upload` | 10/hr | Upload contract (PDF/DOCX/TXT/JPG, max 10MB) |
| `GET` | `/api/documents` | — | List all user documents |
| `GET` | `/api/documents/:id` | — | Get document with full analysis |
| `GET` | `/api/documents/:id/report` | — | Download PDF analysis report |
| `DELETE` | `/api/documents/:id` | — | Delete document |

### Analysis & AI

| Method | Endpoint | Rate Limit | Description |
|:-------|:---------|:-----------|:------------|
| `POST` | `/api/analysis/:docId` | — | Trigger AI analysis pipeline |
| `POST` | `/api/query/:docId` | 30/hr | Ask a question about a contract |

> All authenticated endpoints require the `Authorization: Bearer <token>` header.

---

## 📂 Project Structure

```
clause-scan/
├── package.json                  # Root orchestrator (concurrently)
├── server/
│   ├── index.js                  # Express entry point + MongoDB connection
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification guard
│   ├── models/
│   │   ├── User.js               # User schema (bcrypt hashing)
│   │   └── Document.js           # Document + clause + analysis schemas
│   ├── routes/
│   │   ├── auth.js               # Register & login endpoints
│   │   ├── documents.js          # Upload, list, view, report, delete
│   │   ├── analysis.js           # AI analysis trigger
│   │   └── query.js              # Contract Q&A chatbot
│   ├── services/
│   │   ├── aiService.js          # Groq/Llama 3.3 integration
│   │   ├── documentService.js    # Multi-format text extraction
│   │   ├── lawBookService.js     # Indian law rule matching
│   │   └── reportService.js      # PDFKit report generator
│   └── data/
│       └── lawBook.json          # Indian contract law rule definitions
└── client/
    ├── tailwind.config.js        # Custom design tokens
    └── src/
        ├── App.jsx               # Router + auth provider
        ├── context/
        │   └── AuthContext.jsx    # JWT auth state management
        ├── services/
        │   └── api.js            # Axios client with interceptors
        ├── pages/                # 6 pages (Landing, Login, Register,
        │                         #   Dashboard, Upload, Analysis)
        └── components/           # 17 reusable UI components
```

---

## 🔒 Security

| Feature | Implementation |
|:--------|:---------------|
| **Password Hashing** | bcrypt with 10 salt rounds |
| **Token Auth** | JWT with 7-day expiration |
| **Rate Limiting** | 10 uploads/hr, 30 queries/hr per user |
| **Input Validation** | Server-side checks on all inputs |
| **Owner-Only Access** | Documents scoped to authenticated user |
| **DB Resilience** | Auto-reconnect with exponential backoff (3 retries) |
| **Error Isolation** | Global error handler — no stack traces in responses |

---

## 🗺️ Roadmap

- [ ] Google OAuth integration
- [ ] Bulk contract upload & comparison
- [ ] Contract template library
- [ ] Team workspaces & role-based access
- [ ] Clause versioning & diff tracking
- [ ] Webhook notifications on analysis completion
- [ ] Support for additional Indian languages (Tamil, Telugu, Marathi)
- [ ] Self-hosted LLM option for data-sensitive enterprises

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature`
3. **Commit** your changes: `git commit -m "feat: add your feature"`
4. **Push** to the branch: `git push origin feature/your-feature`
5. **Open** a Pull Request

Please ensure your code follows the existing patterns and includes appropriate error handling.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ for Indian small businesses**

*Justice shouldn't require a lawyer.*

</div>
]]>
