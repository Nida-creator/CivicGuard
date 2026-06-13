import React from 'react'

const navItems = [
  { id: 'scan', icon: '🔍', label: { en: 'Scan', ur: 'اسکین' } },
  { id: 'history', icon: '🕐', label: { en: 'History', ur: 'تاریخ' } },
  { id: 'how', icon: '❓', label: { en: 'How It Works', ur: 'یہ کیسے کام کرتا ہے' } },
  { id: 'report', icon: '🚨', label: { en: 'Report a Scam', ur: 'اسکام رپورٹ کریں' } },
  { id: 'about', icon: 'ℹ️', label: { en: 'About', ur: 'بارے میں' } },
]

export default function Sidebar({ activePage, setActivePage, lang, setLang }) {
  return (
    <aside className="fixed left-0 top-0 w-[220px] h-screen bg-[#0A2A66] flex flex-col overflow-y-auto z-50">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/10">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 bg-[#01411C] rounded-lg flex items-center justify-center text-xl flex-shrink-0">
            🛡️
          </div>
          <span className="text-white text-[18px] font-bold tracking-tight">CivicGuard</span>
        </div>
        <p className={`text-[11px] text-white/50 mt-2 leading-relaxed pl-12 ${lang === 'ur' ? 'font-urdu' : ''}`}>
          {lang === 'ur' ? 'پاکستان کی ڈیجیٹل دھوکے سے حفاظت کی AI ڈھال' : "Pakistan's AI shield against digital scams"}
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 pt-3">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-[13.5px] font-medium mb-0.5 transition-all duration-150 text-left
              ${activePage === item.id
                ? 'bg-[#01411C] text-white'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
          >
            <span className="text-base w-5 text-center">{item.icon}</span>
            <span className={lang === 'ur' ? 'font-urdu text-sm' : ''}>{item.label[lang]}</span>
          </button>
        ))}
      </nav>

      {/* Language Toggle */}
      <div className="mx-3 mb-3">
        <div className="flex border border-white/15 rounded-md overflow-hidden">
          <button
            onClick={() => setLang('en')}
            className={`flex-1 py-2 text-xs font-bold tracking-wide transition-all ${lang === 'en' ? 'bg-[#01411C] text-white' : 'text-white/50 hover:text-white/80'}`}
          >
            English
          </button>
          <button
            onClick={() => setLang('ur')}
            className={`flex-1 py-2 text-xs font-bold tracking-wide transition-all font-urdu ${lang === 'ur' ? 'bg-[#01411C] text-white' : 'text-white/50 hover:text-white/80'}`}
          >
            اردو
          </button>
        </div>
      </div>

      {/* PTA Card */}
      <div className="mx-3 mb-3 bg-white/5 border border-white/10 rounded-lg p-3.5">
        <h4 className={`text-white text-xs font-bold mb-1 ${lang === 'ur' ? 'font-urdu text-right' : ''}`}>
          {lang === 'ur' ? 'اسکام رپورٹ کریں' : 'Report a Scam'}
        </h4>
        <p className={`text-white/55 text-[11px] mb-2.5 leading-relaxed ${lang === 'ur' ? 'font-urdu text-right' : ''}`}>
          {lang === 'ur' ? 'مشکوک پیغامات کو PTA کو رپورٹ کریں' : 'Report suspicious messages or calls to PTA'}
        </p>
        <a
          href="https://pta.gov.pk/complaint"
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-white text-[11.5px] font-semibold border border-white/25 rounded-md py-1.5 hover:bg-white/10 transition-all"
        >
          🔗 Visit PTA Website ↗
        </a>
      </div>

      {/* Minar SVG */}
      <div className="flex justify-center px-4 pb-1 opacity-30">
        <svg width="72" height="82" viewBox="0 0 72 82" fill="none">
          <rect x="31" y="63" width="10" height="18" fill="white"/>
          <rect x="27" y="50" width="18" height="14" fill="white"/>
          <rect x="29" y="37" width="14" height="14" fill="white"/>
          <ellipse cx="36" cy="35" rx="9" ry="4" fill="white"/>
          <rect x="32" y="18" width="8" height="18" fill="white"/>
          <ellipse cx="36" cy="16" rx="5" ry="3.5" fill="white"/>
          <rect x="34" y="5" width="4" height="12" fill="white"/>
          <circle cx="36" cy="4" r="3" fill="white"/>
          <rect x="21" y="62" width="30" height="2.5" fill="white" opacity=".5"/>
          <rect x="14" y="64.5" width="44" height="2" fill="white" opacity=".35"/>
          <rect x="5" y="66.5" width="62" height="15" fill="white" opacity=".12"/>
        </svg>
      </div>

      {/* Hackathon Badge */}
      <div className="text-center px-4 pb-5">
        <p className="text-white/60 text-[10.5px] font-semibold">AI for Civic Innovation</p>
        <p className="text-white/40 text-[10px] mt-0.5">Hackathon 2026</p>
        <p className="text-white/35 text-[10px]">Building a safer digital Pakistan</p>
      </div>
    </aside>
  )
}
