from pydantic import BaseModel
from typing import Optional, Literal

class AnalyzeRequest(BaseModel):
    content: str
    mode: Literal["sms", "email", "url"]
    language: Optional[Literal["en", "ur"]] = "en"

class ThreatBreakdown(BaseModel):
    suspicious_sender: Literal["high", "medium", "low"]
    malicious_link: Literal["high", "medium", "low"]
    urgency_tactics: Literal["high", "medium", "low"]
    personal_info_request: Literal["high", "medium", "low"]
    language_pattern: Literal["high", "medium", "low"]

class AnalyzeResponse(BaseModel):
    verdict: Literal["phishing", "suspicious", "safe"]
    confidence: float
    explanation_en: str
    explanation_ur: str
    threats: ThreatBreakdown
    what_to_do_en: list[str]
    what_to_do_ur: list[str]
    pta_complaint: Optional[str] = None
