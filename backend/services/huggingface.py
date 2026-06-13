import os
import requests
from typing import Optional

HF_API_TOKEN = os.getenv("HUGGINGFACE_API_TOKEN", "")
HF_BASE = "https://api-inference.huggingface.co/models"

TEXT_MODEL = "ealvaradob/bert-finetuned-phishing"
URL_MODEL = "pirocheto/phishing-url-detection"

HEADERS = {"Authorization": f"Bearer {HF_API_TOKEN}"}


def query_text_model(text: str) -> Optional[dict]:
    """Run BERT phishing text classifier."""
    try:
        payload = {"inputs": text[:512]}
        resp = requests.post(f"{HF_BASE}/{TEXT_MODEL}", headers=HEADERS, json=payload, timeout=30)
        resp.raise_for_status()
        result = resp.json()
        if isinstance(result, list) and len(result) > 0:
            labels = result[0] if isinstance(result[0], list) else result
            scores = {item["label"].lower(): item["score"] for item in labels}
            return scores
        return None
    except Exception as e:
        print(f"[HuggingFace Text] Error: {e}")
        return None


def query_url_model(url: str) -> Optional[dict]:
    """Run URL phishing classifier."""
    try:
        payload = {"inputs": url[:512]}
        resp = requests.post(f"{HF_BASE}/{URL_MODEL}", headers=HEADERS, json=payload, timeout=30)
        resp.raise_for_status()
        result = resp.json()
        if isinstance(result, list) and len(result) > 0:
            labels = result[0] if isinstance(result[0], list) else result
            scores = {item["label"].lower(): item["score"] for item in labels}
            return scores
        return None
    except Exception as e:
        print(f"[HuggingFace URL] Error: {e}")
        return None


def extract_urls(text: str) -> list[str]:
    """Extract URLs from text."""
    import re
    url_pattern = r'https?://[^\s<>"]+|www\.[^\s<>"]+'
    return re.findall(url_pattern, text)


def get_hf_score(text: str, mode: str) -> dict:
    """
    Returns a combined score dict:
    { 'phishing_probability': float, 'text_score': float|None, 'url_score': float|None }
    """
    text_score = None
    url_score = None

    if mode in ("sms", "email"):
        scores = query_text_model(text)
        if scores:
            phish_key = next((k for k in scores if "phish" in k), None)
            if phish_key:
                text_score = scores[phish_key]
            else:
                text_score = max(scores.values())

    urls = extract_urls(text)
    if urls:
        url_result = query_url_model(urls[0])
        if url_result:
            phish_key = next((k for k in url_result if "phish" in k or "malicious" in k or "bad" in k), None)
            if phish_key:
                url_score = url_result[phish_key]
            else:
                url_score = max(url_result.values())

    if mode == "url" and not urls:
        url_result = query_url_model(text)
        if url_result:
            phish_key = next((k for k in url_result if "phish" in k or "malicious" in k or "bad" in k), None)
            url_score = url_result.get(phish_key, max(url_result.values()) if url_result else 0.5)

    if text_score is not None and url_score is not None:
        combined = max(text_score, url_score * 1.1)
    elif text_score is not None:
        combined = text_score
    elif url_score is not None:
        combined = url_score
    else:
        combined = None

    return {
        "phishing_probability": combined,
        "text_score": text_score,
        "url_score": url_score,
    }
