import React from 'react'

const modes = [
  { id: 'sms', icon: '💬', label: { en: 'SMS', ur: 'SMS' } },
  { id: 'email', icon: '✉️', label: { en: 'Email', ur: 'ای میل' } },
  { id: 'url', icon: '🔗', label: { en: 'URL', ur: 'URL' } },
]

export default function ModeSelector({ mode, setMode, lang }) {
  return (
    <div className="flex border border-slate-200 rounded-lg overflow-hidden mb-4">
      {modes.map((m) => (
        <button
          key={m.id}
          onClick={() => setMode(m.id)}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold transition-all duration-150 border-0 outline-none
            ${mode === m.id
              ? 'bg-[#e8f5ee] text-[#01411C] border-b-2 border-[#01411C]'
              : 'bg-white text-slate-500 hover:bg-slate-50'
            }
            ${m.id !== 'url' ? 'border-r border-slate-200' : ''}`}
        >
          <span>{m.icon}</span>
          <span className={lang === 'ur' ? 'font-urdu' : ''}>{m.label[lang]}</span>
        </button>
      ))}
    </div>
  )
}
