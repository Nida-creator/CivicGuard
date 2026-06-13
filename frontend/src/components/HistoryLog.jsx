import React from 'react'

const typeIcon = { sms: '💬', email: '✉️', url: '🔗' }
const typeColor = { sms: 'bg-green-50 text-green-600', email: 'bg-blue-50 text-blue-600', url: 'bg-amber-50 text-amber-600' }
const verdictPill = {
  phishing: 'bg-red-50 text-red-600',
  suspicious: 'bg-amber-50 text-amber-600',
  safe: 'bg-green-50 text-green-600',
}
const verdictLabel = {
  phishing: { en: 'Phishing', ur: 'فشنگ' },
  suspicious: { en: 'Suspicious', ur: 'مشکوک' },
  safe: { en: 'Safe', ur: 'محفوظ' },
}
const confBarColor = (pct) => pct >= 71 ? 'bg-red-500' : pct >= 41 ? 'bg-amber-500' : 'bg-green-500'

export default function HistoryLog({ history, lang, limit }) {
  const items = limit ? history.slice(0, limit) : history

  const T = {
    en: { type: 'Type', preview: 'Content Preview', verdict: 'Verdict', conf: 'Confidence', date: 'Date & Time', empty: 'No analyses yet. Scan something!' },
    ur: { type: 'قسم', preview: 'مواد کا خلاصہ', verdict: 'فیصلہ', conf: 'اعتماد', date: 'تاریخ و وقت', empty: 'ابھی تک کوئی تجزیہ نہیں۔ کچھ اسکین کریں!' },
  }
  const L = T[lang]

  if (!items.length) {
    return (
      <div className={`text-center py-10 text-slate-400 text-sm ${lang === 'ur' ? 'font-urdu' : ''}`}>
        <div className="text-4xl mb-3 opacity-40">🛡️</div>
        {L.empty}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {[L.type, L.preview, L.verdict, L.conf, L.date, ''].map((h, i) => (
              <th key={i} className={`text-[11px] font-bold text-slate-400 uppercase tracking-wider pb-3 text-left pr-4 whitespace-nowrap ${lang === 'ur' ? 'font-urdu text-right' : ''}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((item) => {
            const pct = Math.round((item.confidence || 0) * 100)
            return (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 pr-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${typeColor[item.mode] || typeColor.sms}`}>
                    {typeIcon[item.mode] || '💬'}
                  </div>
                </td>
                <td className="py-3 pr-4">
                  <div className="max-w-[200px] truncate text-[12.5px] text-slate-600" title={item.content}>
                    {(item.content || '').substring(0, 65)}...
                  </div>
                </td>
                <td className="py-3 pr-4">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${verdictPill[item.verdict] || verdictPill.suspicious} ${lang === 'ur' ? 'font-urdu' : ''}`}>
                    {(verdictLabel[item.verdict] || verdictLabel.suspicious)[lang]}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${confBarColor(pct)}`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-[11px] text-slate-500">{pct}%</span>
                  </div>
                </td>
                <td className="py-3 pr-4">
                  <span className="text-[11.5px] text-slate-400 whitespace-nowrap">{item.timestamp}</span>
                </td>
                <td className="py-3">
                  <span className="text-slate-300 text-base">›</span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
