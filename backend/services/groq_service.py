import os
import json
from groq import Groq

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")


def get_groq_analysis(content: str, mode: str, hf_score: dict) -> dict:
    """
    Use Groq (Llama 3) to generate:
    - English + Urdu explanations
    - Threat breakdown scores
    - What to do next
    - PTA complaint draft
    """
    client = Groq(api_key=GROQ_API_KEY)

    phish_prob = hf_score.get("phishing_probability")
    prob_hint = f"{round(phish_prob * 100)}% phishing probability" if phish_prob else "unknown probability"

    system_prompt = """You are CivicGuard, Pakistan's AI-powered phishing detection assistant. 
You analyze suspicious SMS, email, and URL content and explain threats clearly to Pakistani citizens.
Respond ONLY with valid JSON. No markdown, no backticks, no extra text before or after the JSON."""

    user_prompt = f"""Analyze this {mode.upper()} content for phishing/scam indicators.
The HuggingFace ML model gave: {prob_hint}

Content: "{content}"

Return ONLY this JSON structure:
{{
  "verdict": "phishing" or "suspicious" or "safe",
  "confidence": 0.0 to 1.0,
  "explanation_en": "2-3 clear sentences explaining the threat in English for a Pakistani citizen",
  "explanation_ur": "2-3 clear sentences in Urdu script explaining the threat",
  "threats": {{
    "suspicious_sender": "high" or "medium" or "low",
    "malicious_link": "high" or "medium" or "low",
    "urgency_tactics": "high" or "medium" or "low",
    "personal_info_request": "high" or "medium" or "low",
    "language_pattern": "high" or "medium" or "low"
  }},
  "what_to_do_en": ["action 1", "action 2", "action 3", "action 4"],
  "what_to_do_ur": ["اردو میں کارروائی 1", "اردو میں کارروائی 2", "اردو میں کارروائی 3", "اردو میں کارروائی 4"],
  "pta_complaint": "Pre-filled PTA complaint text including the original message summary, threat details, and recommendation"
}}"""

    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            model="llama3-8b-8192",
            temperature=0.2,
            max_tokens=1500,
        )
        raw = chat_completion.choices[0].message.content.strip()
        raw = raw.replace("```json", "").replace("```", "").strip()
        return json.loads(raw)
    except json.JSONDecodeError as e:
        print(f"[Groq] JSON parse error: {e}\nRaw: {raw}")
        return _fallback_response(content, mode, hf_score)
    except Exception as e:
        print(f"[Groq] Error: {e}")
        return _fallback_response(content, mode, hf_score)


def _fallback_response(content: str, mode: str, hf_score: dict) -> dict:
    """Rule-based fallback when Groq is unavailable."""
    prob = hf_score.get("phishing_probability", 0.5)
    if prob is None:
        prob = _rule_based_score(content)

    if prob >= 0.7:
        verdict = "phishing"
        confidence = min(prob, 0.98)
    elif prob >= 0.4:
        verdict = "suspicious"
        confidence = prob
    else:
        verdict = "safe"
        confidence = 1 - prob

    has_url = any(x in content.lower() for x in ["http", "www.", ".com", ".net", ".pk"])
    has_urgency = any(x in content.lower() for x in ["urgent", "expire", "suspend", "immediate", "now", "فوری", "ابھی"])
    has_personal = any(x in content.lower() for x in ["cnic", "password", "otp", "pin", "account", "verify"])

    return {
        "verdict": verdict,
        "confidence": round(confidence, 2),
        "explanation_en": (
            "This message shows multiple phishing indicators including suspicious links and urgency tactics. "
            "It appears to impersonate a Pakistani government or banking institution. "
            "Do not click any links or share personal information."
        ) if verdict == "phishing" else (
            "This message has some characteristics that warrant caution. "
            "Verify the sender independently before taking any action."
        ) if verdict == "suspicious" else (
            "This message appears to be safe. No significant phishing indicators were detected. "
            "Always remain vigilant and verify sources before sharing personal information."
        ),
        "explanation_ur": (
            "اس پیغام میں فشنگ کی متعدد علامات ہیں۔ یہ پاکستانی حکومت یا بینک کی نقالی کرتا لگتا ہے۔ "
            "کسی بھی لنک پر کلک نہ کریں اور ذاتی معلومات شیئر نہ کریں۔"
        ) if verdict == "phishing" else (
            "اس پیغام میں کچھ مشکوک خصوصیات ہیں۔ کوئی بھی کارروائی کرنے سے پہلے بھیجنے والے کی تصدیق کریں۔"
        ) if verdict == "suspicious" else (
            "یہ پیغام محفوظ لگتا ہے۔ کوئی اہم فشنگ اشارے نہیں پائے گئے۔ ہمیشہ محتاط رہیں۔"
        ),
        "threats": {
            "suspicious_sender": "high" if verdict == "phishing" else "medium" if verdict == "suspicious" else "low",
            "malicious_link": "high" if (has_url and verdict == "phishing") else "medium" if has_url else "low",
            "urgency_tactics": "high" if has_urgency else "low",
            "personal_info_request": "high" if has_personal else "low",
            "language_pattern": "medium" if verdict != "safe" else "low",
        },
        "what_to_do_en": [
            "Do not click any links in this message",
            "Do not reply or share personal information",
            "Block the sender immediately",
            "Report to PTA at pta.gov.pk/complaint or SMS 9000",
        ],
        "what_to_do_ur": [
            "اس پیغام میں کسی بھی لنک پر کلک نہ کریں",
            "جواب نہ دیں اور ذاتی معلومات شیئر نہ کریں",
            "بھیجنے والے کو فوری بلاک کریں",
            "PTA کو pta.gov.pk/complaint پر رپورٹ کریں یا 9000 پر SMS کریں",
        ],
        "pta_complaint": (
            f"Complaint Type: Phishing Scam\n"
            f"Content Type: {mode.upper()}\n"
            f"Threat Level: {verdict.capitalize()}\n"
            f"AI Confidence: {round(confidence * 100)}%\n\n"
            f"Description: A suspicious {mode} was detected with phishing characteristics.\n\n"
            f"Original Content:\n{content[:500]}"
        ),
    }


def _rule_based_score(content: str) -> float:
    """Simple rule-based phishing score as last resort."""
    score = 0.1
    text = content.lower()
    if any(x in text for x in ["nadra", "fbr", "hbl", "meezan", "ubl", "mcb"]):
        score += 0.2
    if any(x in text for x in ["http://", "bit.ly", ".xyz", "-update", "gov-"]):
        score += 0.3
    if any(x in text for x in ["urgent", "expire", "suspend", "verify now", "click"]):
        score += 0.2
    if any(x in text for x in ["cnic", "password", "otp", "pin"]):
        score += 0.2
    return min(score, 0.99)
