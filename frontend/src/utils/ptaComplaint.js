export const generatePTAComplaint = ({ verdict, confidence, mode, content, threats }) => {
  const now = new Date().toLocaleString('en-PK')
  const confPct = Math.round(confidence * 100)
  return `Pakistan Telecommunication Authority
Online Complaint – CivicGuard AI Detection
=============================================
Date & Time: ${now}
Complaint Type: Phishing / Digital Scam
Content Type: ${mode.toUpperCase()}
AI Confidence: ${confPct}%
Threat Level: ${verdict.charAt(0).toUpperCase() + verdict.slice(1)}

THREAT DETAILS:
• Suspicious Sender/Source: ${(threats?.suspicious_sender || 'low').toUpperCase()}
• Malicious Link Detected: ${(threats?.malicious_link || 'low').toUpperCase()}
• Urgency/Pressure Tactics: ${(threats?.urgency_tactics || 'low').toUpperCase()}
• Personal Info Request: ${(threats?.personal_info_request || 'low').toUpperCase()}
• Language Pattern: ${(threats?.language_pattern || 'low').toUpperCase()}

ORIGINAL CONTENT:
${content}

─────────────────────────────────────────────
Submitted via CivicGuard
Pakistan's AI Shield Against Digital Scams
civicguard.vercel.app | Hackathon 2026`
}
