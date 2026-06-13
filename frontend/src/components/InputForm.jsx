import React from 'react'

export default function InputForm({ value, onChange, mode, lang }) {
  const MAX = 2000
  const placeholders = {
    en: {
      sms: 'Paste suspicious SMS here...',
      email: 'Paste suspicious email content here...',
      url: 'Paste suspicious URL here (e.g. http://example.com/verify)...',
    },
    ur: {
      sms: 'یہاں مشکوک SMS پیسٹ کریں...',
      email: 'یہاں مشکوک ای میل پیسٹ کریں...',
      url: 'یہاں مشکوک URL پیسٹ کریں...',
    },
  }

  return (
    <div className="relative mb-4">
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        maxLength={MAX}
        placeholder={placeholders[lang][mode]}
        rows={5}
        className={`w-full resize-y border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#01411C] focus:ring-1 focus:ring-[#01411C]/20 transition-all duration-150 leading-relaxed bg-white
          ${lang === 'ur' ? 'font-urdu text-base' : ''}
          ${mode === 'url' ? 'font-mono text-sm' : ''}`}
        dir={lang === 'ur' ? 'rtl' : 'ltr'}
      />
      <span className={`absolute bottom-3 text-xs text-slate-400 ${lang === 'ur' ? 'left-3' : 'right-3'}`}>
        {value.length} / {MAX}
      </span>
    </div>
  )
}
