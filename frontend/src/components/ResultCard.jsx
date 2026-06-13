import React from 'react'
import ConfidenceGauge from './ConfidenceGauge'

const verdictConfig = {
  phishing: {
    icon: '⚠️',
    bgClass: 'bg-red-50 border-red-200',
    textClass: 'text-red-600',
    label: { en: 'Phishing', ur: 'فشنگ' },
    summary: { en: 'This content is likely to be a scam.', ur: 'یہ مواد ممکنہ طور پر دھوکہ دہی ہے۔' },
  },
  suspicious: {
    icon: '🔔',
    bgClass: 'bg-amber-50 border-amber-200',
    textClass: 'text-amber-500',
    label: { en: 'Suspicious', ur: 'مشکوک' },
    summary: { en: 'This content shows suspicious signs. Proceed with caution.', ur: 'اس مواد میں مشکوک علامات ہیں۔ احتیاط کریں۔' },
  },
  safe: {
    icon: '✅',
    bgClass: 'bg-green-50 border-green-200',
    textClass: 'text-green-600',
    label: { en: 'Safe', ur: 'محفوظ' },
    summary: { en: 'This content appears to be safe.', ur: 'یہ مواد محفوظ لگتا ہے۔' },
  },
}

export default function ResultCard({ result, lang }) {
  const cfg = verdictConfig[result.verdict] || verdictConfig.suspicious
  const verdictLabel = { en: 'Verdict', ur: 'فیصلہ' }
  const confLabel = { en: 'Confidence Score', ur: 'اعتماد اسکور' }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5 slide-in">
      {/* Verdict */}
      <div className={`rounded-2xl border p-6 ${cfg.bgClass}`}>
        <div className="flex items-center gap-4 mb-3">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl flex-shrink-0 ${result.verdict === 'phishing' ? 'bg-red-100' : result.verdict === 'suspicious' ? 'bg-amber-100' : 'bg-green-100'}`}>
            {cfg.icon}
          </div>
          <div>
            <div className={`text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1 ${lang === 'ur' ? 'font-urdu' : ''}`}>
              {verdictLabel[lang]}
            </div>
            <div className={`text-2xl font-extrabold tracking-tight ${cfg.textClass} ${lang === 'ur' ? 'font-urdu' : ''}`}>
              {cfg.label[lang]}
            </div>
          </div>
        </div>
        <p className={`text-sm text-slate-600 leading-relaxed ${lang === 'ur' ? 'font-urdu text-right' : ''}`}>
          {cfg.summary[lang]}
        </p>
      </div>

      {/* Confidence */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center justify-center shadow-sm">
        <div className={`text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5 ${lang === 'ur' ? 'font-urdu' : ''}`}>
          {confLabel[lang]}
          <span className="text-slate-300 cursor-help" title="How certain our AI is about this verdict">ⓘ</span>
        </div>
        <ConfidenceGauge confidence={result.confidence} lang={lang} />
      </div>
    </div>
  )
}
