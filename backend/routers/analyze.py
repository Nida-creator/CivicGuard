from fastapi import APIRouter, HTTPException
from models.schemas import AnalyzeRequest, AnalyzeResponse, ThreatBreakdown
from services.huggingface import get_hf_score
from services.groq_service import get_groq_analysis
from services.verdict import combine_verdict
from datetime import datetime

router = APIRouter()


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze(request: AnalyzeRequest):
    content = request.content.strip()
    if not content:
        raise HTTPException(status_code=400, detail="Content cannot be empty")
    if len(content) > 2000:
        raise HTTPException(status_code=400, detail="Content too long (max 2000 characters)")

    hf_score = get_hf_score(content, request.mode)
    groq_result = get_groq_analysis(content, request.mode, hf_score)
    final = combine_verdict(hf_score, groq_result)

    threats_data = final.get("threats", {})
    threats = ThreatBreakdown(
        suspicious_sender=threats_data.get("suspicious_sender", "low"),
        malicious_link=threats_data.get("malicious_link", "low"),
        urgency_tactics=threats_data.get("urgency_tactics", "low"),
        personal_info_request=threats_data.get("personal_info_request", "low"),
        language_pattern=threats_data.get("language_pattern", "low"),
    )

    pta_complaint = None
    if final.get("verdict") in ("phishing", "suspicious"):
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        pta_complaint = (
            f"Pakistan Telecommunication Authority\n"
            f"Online Complaint – CivicGuard AI Detection\n"
            f"{'='*45}\n"
            f"Date: {now}\n"
            f"Complaint Type: Phishing/Digital Scam\n"
            f"Content Type: {request.mode.upper()}\n"
            f"AI Confidence: {round(final['confidence'] * 100)}%\n"
            f"Threat Level: {final['verdict'].capitalize()}\n\n"
            f"Threat Details:\n"
            f"- Suspicious Sender: {threats.suspicious_sender.upper()}\n"
            f"- Malicious Link: {threats.malicious_link.upper()}\n"
            f"- Urgency Tactics: {threats.urgency_tactics.upper()}\n"
            f"- Personal Info Request: {threats.personal_info_request.upper()}\n"
            f"- Language Pattern: {threats.language_pattern.upper()}\n\n"
            f"AI Explanation:\n{final.get('explanation_en', '')}\n\n"
            f"Original Content:\n{content}\n\n"
            f"Submitted via CivicGuard – Pakistan's AI Shield Against Digital Scams\n"
            f"Website: civicguard.vercel.app"
        )

    return AnalyzeResponse(
        verdict=final.get("verdict", "suspicious"),
        confidence=final.get("confidence", 0.5),
        explanation_en=final.get("explanation_en", ""),
        explanation_ur=final.get("explanation_ur", ""),
        threats=threats,
        what_to_do_en=final.get("what_to_do_en", []),
        what_to_do_ur=final.get("what_to_do_ur", []),
        pta_complaint=pta_complaint,
    )
