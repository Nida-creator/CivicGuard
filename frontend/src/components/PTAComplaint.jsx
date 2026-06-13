import React, { useState } from 'react'
import { generatePTAComplaint } from '../utils/ptaComplaint'

export default function PTAComplaint({ result, lang }) {
  const [copied, setCopied] = useState(false)

  if (!result || result.verdict === 'safe') return null

  const complaintText = result.pta_complaint || generatePTAComplaint({
    verdict: result.verdict,
    confidence: result.confidence,
    mode: result.mode,
    content: result.content,
    threats: result.threats,
  })

  const confPct = Math.round((result.confidence || 0) * 100)

  const T = {
    en: {
      title: '📋 PTA Complaint Draft',
      sub: 'Auto-generated complaint ready to submit to PTA',
      type: 'Complaint Type', typeVal: 'Phishing Scam',
      contentType: 'Content Type',
      confidence: 'Confidence',
      threat: 'Threat Level',
      copy: '📋 Copy Complaint',
      copied: '✅ Copied!',
      report: '🔗 Report to PTA ↗',
    },
    ur: {
      title: '📋 PTA شکایت مسودہ',
      sub: 'PTA کو جمع کرنے کے لیے تیار خودکار شکایت',
      type: 'شکایت کی قسم', typeVal: 'فشنگ اسکام',
      contentType: 'مواد کی قسم',
      confidence: 'اعتماد',
      threat: 'خطرے کی سطح',
      copy: '📋 شکایت کاپی کریں',
      copied: '✅ کاپی ہو گیا!',
      report: '🔗 PTA کو رپورٹ کریں ↗',
    },
  }
  const L = T[lang]

  const threatLevel = result.verdict === 'phishing'
    ? (lang === 'ur' ? 'اعلیٰ' : 'High')
    : (lang === 'ur' ? 'درمیانہ' : 'Medium')

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(complaintText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      const el = document.createElement('textarea')
      el.value = complaintText
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-[#0A2A66] p-6 mb-5 shadow-sm slide-in">
      <div className="mb-4">
        <h3 className={`text-[15px] font-bold text-[#0A2A66] mb-0.5 ${lang === 'ur' ? 'font-urdu text-right' : ''}`}>
          {L.title}
        </h3>
        <p className={`text-xs text-slate-500 ${lang === 'ur' ? 'font-urdu text-right' : ''}`}>{L.sub}</p>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        {[
          { label: L.type, value: L.typeVal },
          { label: L.contentType, value: (result.mode || 'SMS').toUpperCase() },
          { label: L.confidence, value: confPct + '%' },
          { label: L.threat, value: threatLevel },
        ].map(({ label, value }) => (
          <div key={label} className="bg-slate-50 rounded-lg px-3 py-2.5">
            <div className={`text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 ${lang === 'ur' ? 'font-urdu text-right' : ''}`}>
              {label}
            </div>
            <div className={`text-[13px] font-bold text-slate-800 ${lang === 'ur' ? 'font-urdu text-right' : ''}`}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Complaint text box */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-[12px] text-slate-600 leading-relaxed max-h-36 overflow-y-auto mb-3 font-mono whitespace-pre-wrap break-words">
        {complaintText}
      </div>

      {/* Buttons */}
      <div className="flex gap-2.5">
        <button
          onClick={handleCopy}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-[13px] font-bold transition-all duration-150
            ${copied
              ? 'border-green-400 text-green-600 bg-green-50'
              : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            } ${lang === 'ur' ? 'font-urdu' : ''}`}
        >
          {copied ? L.copied : L.copy}
        </button>
        <a
          href="https://pta.gov.pk/complaint"
          target="_blank"
          rel="noopener noreferrer"
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-[#0A2A66] text-[#0A2A66] text-[13px] font-bold hover:bg-[#e8eef8] transition-all duration-150 no-underline ${lang === 'ur' ? 'font-urdu' : ''}`}
        >
          {L.report}
        </a>
      </div>
    </div>
  )
}
