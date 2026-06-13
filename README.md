# CivicGuard 🛡️
**Pakistan's AI Shield Against Digital Scams**

## How to Run

### BACKEND SETUP

1. Open terminal, go to backend folder:
   ```
   cd civicguard/backend
   ```

2. Create virtual environment:
   ```
   python -m venv venv
   ```

3. Activate it:
   - Windows:  venv\Scripts\activate
   - Mac/Linux: source venv/bin/activate

4. Install packages:
   ```
   pip install -r requirements.txt
   ```

5. Create .env file (copy from .env.example):
   ```
   HUGGINGFACE_API_TOKEN=your_token_here
   GROQ_API_KEY=your_key_here
   ```

6. Run backend:
   ```
   uvicorn main:app --reload --port 8000
   ```
   Backend runs at: http://localhost:8000

---

### FRONTEND SETUP

1. Open a NEW terminal, go to frontend folder:
   ```
   cd civicguard/frontend
   ```

2. Install packages:
   ```
   npm install
   ```

3. Create .env file:
   ```
   VITE_BACKEND_URL=http://localhost:8000
   ```

4. Run frontend:
   ```
   npm run dev
   ```
   Website opens at: http://localhost:3000

---

### GET API KEYS

- HuggingFace: https://huggingface.co → Settings → Access Tokens → New Token
- Groq: https://console.groq.com → API Keys → Create new key

Both are FREE.
