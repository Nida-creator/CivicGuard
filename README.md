# CivicGuard 🛡️
### Pakistan's AI Shield Against Digital Scams

**Live app:** [civic-guard-gamma.vercel.app](https://civic-guard-gamma.vercel.app)

---

## What it does

CivicGuard is a bilingual (Urdu/English) web app that helps Pakistani citizens identify scams before they become victims.

Paste any suspicious SMS, email, or URL — CivicGuard instantly tells you whether it's safe, suspicious, or a phishing attempt. It's built specifically around Pakistani scam patterns: fake NADRA messages threatening CNIC suspension, fake FBR emails promising tax refunds, fake bank alerts from HBL or Meezan asking for your ATM PIN.

It doesn't just give you a verdict — it explains exactly *why* something is suspicious, in plain language, in the language you choose.

**Key features:**
- Instant threat analysis on SMS, email text, and URLs
- Risk level breakdown with confidence score
- Plain language explanation in Urdu or English
- Auto-generated PTA complaint form, pre-filled and ready to submit in one click
- Targets real Pakistani scam patterns, not generic phishing examples

**Built for:** general Pakistani public — especially less tech-savvy citizens who receive government-impersonation scams daily.

---

## How it works

1. User pastes suspicious message or URL
2. Two fine-tuned HuggingFace BERT models analyse it — one for text, one for URLs
3. Results are combined into a single confidence score
4. Groq Llama 3 generates a plain language explanation in Urdu or English
5. If phishing is detected, a pre-filled PTA complaint is auto-generated

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | React · Vite |
| Backend | FastAPI · Python |
| AI Models | HuggingFace BERT (text + URL) · Groq Llama 3 |
| Deployment | Vercel |
| APIs | HuggingFace Inference API · Groq API |

---

## Run it locally

**Backend**

```bash
cd civicguard/backend
python -m venv venv

# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file:
```
HUGGINGFACE_API_TOKEN=your_token_here
GROQ_API_KEY=your_key_here
```

```bash
uvicorn main:app --reload --port 8000
```
Backend runs at: http://localhost:8000

**Frontend**

```bash
cd civicguard/frontend
npm install
```

Create a `.env` file:
```
VITE_BACKEND_URL=http://localhost:8000
```

```bash
npm run dev
```
App runs at: http://localhost:3000

**Get free API keys**
- HuggingFace: [huggingface.co](https://huggingface.co) → Settings → Access Tokens
- Groq: [console.groq.com](https://console.groq.com) → API Keys

---

## Context

Built at the Code for Pakistan hackathon as a 3-day sprint and presented to an industry panel. Designed to address a real and growing problem — digital scam literacy among general Pakistani citizens.

---

*Built by [Nida](https://github.com/Nida-creator)*
