# FinGuard 🛡️

### AI-Powered Financial Scam & Misinformation Detector

FinGuard is an AI-powered web application that helps users detect suspicious financial messages, understand **why** a message may be risky, and verify factual claims before acting on them.

> **Verify before you invest.**

## What FinGuard Does

Users can paste a financial message, upload a screenshot, or use voice input. FinGuard combines a deterministic safety-rule engine with Gemini AI to identify potential warning signs and explain them using evidence from the original message.

It can detect indicators such as:

- Guaranteed or unusually strong return claims
- Urgency and FOMO
- Scarcity / limited availability
- Insider-information claims
- Payment requests
- Suspicious external links
- Unverified authority or regulatory claims

FinGuard also extracts potentially verifiable claims and lets the user trigger web-grounded verification.

## Key Features

**🔍 AI Message Analysis**  
Analyze financial messages with Gemini AI and rule-based safety checks.

**⚠️ Explainable Risk Detection**  
Shows the exact phrases that triggered a warning instead of giving only a generic risk label.

**📸 Screenshot → OCR → Analysis**  
Upload a screenshot and extract its text with OCR before analysis.

**🎙️ Voice Input**  
Use browser speech recognition to enter messages by voice.

**🌐 English / Hindi / Hinglish**  
Designed to handle common multilingual financial conversations.

**🧾 Claim Extraction**  
Identifies claims about returns, predictions, authority, monetary amounts, and other factual statements.

**✅ Claim Verification**  
Lets users verify selected claims using web-grounded AI analysis and displays supporting source links when available.

**💬 Ask FinGuard Why?**  
Expands the analysis to show the detected evidence, indicator type, and explanation.

**🧪 Judge Demo Cases**  
Includes ready-to-run examples covering guaranteed-return scams, insider tips, fake authority claims, suspicious links, unverified claims, and normal SIP messages.

## How It Works

```text
User
 │
 ├── Text ───────────────┐
 ├── Screenshot → OCR ───┤
 └── Voice ──────────────┘
                         │
                         ▼
                FinGuard Frontend
                         │
                         ▼
                 Node.js / Express
                         │
             ┌───────────┴───────────┐
             ▼                       ▼
      Safety Rule Engine         Gemini AI
             │                       │
             └───────────┬───────────┘
                         ▼
               Risk + Evidence +
              Claims + Safety Actions
                         │
                         ▼
                User-triggered Claim
                    Verification
```

## Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript
- Tesseract.js
- Web Speech API

### Backend
- Node.js
- Express.js
- CORS
- dotenv

### AI / Verification
- Google Gemini API
- Gemini web/search grounding for claim verification

## Project Structure

```text
FinGuard/
├── index.html
├── demo.js
├── features.js
├── .gitignore
├── package.json
├── package-lock.json
└── backend/
    └── server.js
```

`node_modules/` and `.env` are intentionally excluded from GitHub.

## Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/ShreyesB07/FinGuard.git
cd FinGuard
```

### 2. Install dependencies

Install the Node.js dependencies from the location containing `package.json`:

```bash
npm install
```

### 3. Add your Gemini API key

Create:

```text
backend/.env
```

Add:

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
GEMINI_MODEL=gemini-3.8-flash
PORT=5000
```

Never commit your `.env` file or API key.

### 4. Start the backend

```bash
node backend/server.js
```

The API runs on:

```text
http://127.0.0.1:5000
```

### 5. Start the frontend

From the project root, open another Terminal window and run:

```bash
python3 -m http.server 5500
```

Then open:

```text
http://localhost:5500
```

## API

### `GET /api/health`
Checks backend status and AI configuration.

### `POST /api/analyze`
Analyzes a financial message and returns risk level, evidence, indicators, claims, and safety actions.

### `POST /api/verify`
Verifies a selected claim using web-grounded AI analysis.

## Safety by Design

FinGuard is built as an information and verification tool, not an investment advisor.

It does **not** provide:

- Buy/sell recommendations
- Personalized investment advice
- Price predictions
- Guaranteed investment outcomes

AI-generated warning evidence is checked against the original message so that unsupported phrases are not presented as detected evidence.

## Example

Input:

```text
Invest ₹10,000 today and get 300% guaranteed profit in 7 days!
```

FinGuard can surface indicators such as:

- Guaranteed return claim
- Unusually strong return
- Urgency / pressure
- Financial solicitation

It then explains the evidence instead of simply displaying a risk score.

## Why FinGuard?

Financial misinformation is often persuasive because it creates **urgency, fear of missing out, false authority, or unrealistic expectations**.

FinGuard focuses on three simple questions:

1. **What looks suspicious?**
2. **Why is it suspicious?**
3. **What can I verify?**

## Disclaimer

FinGuard is an informational safety and verification tool for educational and hackathon purposes. It is not a financial advisor and does not provide personalized investment recommendations or guaranteed predictions.

## Author

**ShreyesB07**  
GitHub: https://github.com/ShreyesB07/FinGuard
