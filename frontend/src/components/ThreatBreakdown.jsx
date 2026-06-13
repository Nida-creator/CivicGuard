import React from 'react'

const THREAT_CONFIG = [
  {
    key: 'suspicious_sender',
    icon: '👤',
    label: { en: 'Suspicious Sender / Source', ur: 'مشکوک بھیجنے والا / ذریعہ' },
    desc: { en: 'The sender address or domain looks suspicious.', ur: 'بھیجنے والے کا پتہ یا ڈومین مشکوک لگتا ہے۔' },
  },
  {
    key: 'malicious_link',
    icon: '🔗',
    label: { en: 'Malicious Link Detected', ur: 'نقصان دہ لنک پایا گیا' },
    desc: { en: 'The link in this content is flagged as potentially harmful.', ur: 'اس مواد میں لنک ممکنہ طور پر نقصان دہ ہے۔' },
  },
  {
    key: 'urgency_tactics',
    icon: '⏰',
    label: { en: 'Urgency / Pressure Tactics', ur: 'فوریت / دباؤ کی حکمت عملی' },
    desc: { en: 'The message tries to create urgency or fear.', ur: 'پیغام فوریت یا خوف پیدا کرنے کی کوشش کرتا ہے۔' },
  },
  {
    key: 'personal_info_request',
    icon: '🔐',
    label: { en: 'Personal Information Request', ur: 'ذاتی معلومات کی درخواست' },
    desc: { en: 'Checks if sensitive personal information is being requested.', ur: 'دیکھتا ہے کہ کیا حساس ذاتی معلومات مانگی جا رہی ہیں۔' },
  },
  {
    key: 'language_pattern',
    icon: '🗣️',
    label: { en: 'Language Pattern Analysis', ur: 'زبان کے نمونے کا تجزیہ' },
    desc: { en: 'Analysis of language patterns and phrasing.', ur: 'زبان کے نمونے اور جملوں کا تجزیہ۔' },
  },
]

const RISK_STYLES = {
  high: { badge: 'bg-red-100 text-red-700', icon: 'bg-red-50 text-red-500', label: { en: 'High Risk', ur: 'اعلیٰ خطرہ' } },
  medium: { badge: 'bg-amber-100 text-amber-700', icon: 'bg-amber-50 text-amber-500', label: { en: 'Medium Risk', ur: 'درمیانہ خطرہ' } },
  low: { badge: 'bg-green-100 text-green-700', icon: 'bg-green-50 text-green-500', label: { en: 'Low Risk', ur: 'کم خطرہ' } },
}

export default function ThreatBreakdown({ threats, lang }) {
  const title = { en: 'Threat Breakdown', ur: 'خطرے کا تجزیہ' }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-5 shadow-sm slide-in">
      <h3 className={`text-[15px] font-bold text-slate-800 mb-4 ${lang === 'ur' ? 'font-urdu text-right' : ''}`}>
        {title[lang]}
      </h3>
      <div className="divide-y divide-slate-100">
        {THREAT_CONFIG.map(({ key, icon, label, desc }) => {
          const level = threats?.[key] || 'low'
          const style = RISK_STYLES[level]
          return (
            <div key={key} className={`flex items-start gap-3 py-3 ${lang === 'ur' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0 mt-0.5 ${style.icon}`}>
                {icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-[13.5px] font-semibold text-slate-800 mb-0.5 ${lang === 'ur' ? 'font-urdu text-right' : ''}`}>
                  {label[lang]}
                </div>
                <div className={`text-xs text-slate-500 leading-relaxed ${lang === 'ur' ? 'font-urdu text-right' : ''}`}>
                  {desc[lang]}
                </div>
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${style.badge} ${lang === 'ur' ? 'font-urdu' : ''}`}>
                {style.label[lang]}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
