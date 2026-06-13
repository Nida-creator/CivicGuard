def combine_verdict(hf_score: dict, groq_result: dict) -> dict:
    """
    Combines HuggingFace ML score with Groq LLM analysis.
    HuggingFace score is used to calibrate confidence.
    Groq provides the final verdict and explanation.
    """
    hf_prob = hf_score.get("phishing_probability")

    groq_verdict = groq_result.get("verdict", "suspicious")
    groq_confidence = groq_result.get("confidence", 0.5)

    if hf_prob is not None:
        if groq_verdict == "phishing":
            final_confidence = max(groq_confidence, hf_prob * 0.9)
        elif groq_verdict == "safe":
            final_confidence = min(groq_confidence, (1 - hf_prob) * 0.95 + 0.05)
        else:
            final_confidence = (groq_confidence + hf_prob) / 2
    else:
        final_confidence = groq_confidence

    final_confidence = round(min(max(final_confidence, 0.01), 0.99), 2)

    groq_result["confidence"] = final_confidence
    return groq_result
