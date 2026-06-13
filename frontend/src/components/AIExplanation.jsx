import React from 'react'

export default function AIExplanation({ result, lang }) {
  const explanation = lang === 'ur' ? result.explanation_ur : result.explanation_en
  const whatToDo = lang === 'ur' ? result.what_to_do_ur : result.what_to_do_en

  const titles = {
    en: { exp: 'AI Explanation', what: 'What to do next', report: '🔗 Report to PTA ↗' },
    ur: { exp: 'AI وضاحت', what: 'اب کیا کریں', report: '🔗 PTA کو رپورٹ کریں ↗' },
  }
  const T = titles[lang]

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm slide-in">
      <h3 className={`text-[15px] font-bold text-slate-800 mb-3 ${lang === 'ur' ? 'font-urdu text-right' : ''}`}>
        {T.exp}
      </h3>
      <p className={`text-[13.5px] text-slate-600 leading-relaxed mb-5 ${lang === 'ur' ? 'font-urdu text-right leading-loose' : ''}`}>
        {explanation}
      </p>

      <h4 className={`text-[13.5px] font-bold text-slate-700 mb-3 ${lang === 'ur' ? 'font-urdu text-right' : ''}`}>
        {T.what}
      </h4>
      <ul className="space-y-2 mb-5">
        {(whatToDo || []).map((item, i) => (
          <li key={i} className={`flex items-start gap-2 text-[13px] text-slate-700 ${lang === 'ur' ? 'flex-row-reverse font-urdu' : ''}`}>
            <span className="text-[#01411C] font-bold text-base leading-none mt-0.5 flex-shrink-0">•</span>
            <span className={lang === 'ur' ? 'text-right' : ''}>{item}</span>
          </li>
        ))}
      </ul>

      <a
        href="https://pta.gov.pk/complaint"
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border-2 border-[#0A2A66] text-[#0A2A66] text-[13px] font-bold hover:bg-[#e8eef8] transition-all duration-150 ${lang === 'ur' ? 'font-urdu' : ''}`}
      >
        {T.report}
      </a>
    </div>
  )
}
