import React, { useState, useEffect, useRef } from 'react'
import Sidebar from './components/Sidebar'
import ModeSelector from './components/ModeSelector'
import InputForm from './components/InputForm'
import DemoButtons from './components/DemoButtons'
import LoadingSpinner from './components/LoadingSpinner'
import ResultCard from './components/ResultCard'
import ThreatBreakdown from './components/ThreatBreakdown'
import AIExplanation from './components/AIExplanation'
import PTAComplaint from './components/PTAComplaint'
import HistoryLog from './components/HistoryLog'
import { analyzeContent } from './utils/api'
import { saveToHistory, getHistory, clearHistory, getStats } from './utils/storage'

export default function App() {
  const [lang, setLang] = useState('en')
  const [activePage, setActivePage] = useState('scan')
  const [mode, setMode] = useState('sms')
  const [inputText, setInputText] = useState('')
  const [loading, setLoading] = useState(false)
  const [showWakeup, setShowWakeup] = useState(false)
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])
  const [stats, setStats] = useState({ total: 0, phishing: 0, suspicious: 0, safe: 0 })
  const [error, setError] = useState(null)
  const wakeupTimer = useRef(null)

  useEffect(() => {
    const h = getHistory()
    setHistory(h)
    setStats(getStats())
  }, [])

  const handleDemoLoad = ({ mode: demoMode, text }) => {
    setMode(demoMode)
    setInputText(text)
    setResult(null)
    setError(null)
  }

  const handleAnalyze = async () => {
    const content = inputText.trim()
    if (!content) {
      alert(lang === 'ur' ? 'براہ کرم پہلے پیغام پیسٹ کریں۔' : 'Please paste a message first.')
      return
    }
    setLoading(true)
    setError(null)
    setResult(null)
    setShowWakeup(false)
    wakeupTimer.current = setTimeout(() => setShowWakeup(true), 5000)

    try {
      const data = await analyzeContent({ content, mode, language: lang })
      const enriched = { ...data, mode, content }
      setResult(enriched)
      const newHistory = saveToHistory(enriched)
      setHistory(newHistory)
      setStats(getStats())
    } catch (err) {
      console.error('Analyze error:', err)
      setError(lang === 'ur'
        ? 'AI سرور سے منسلک نہیں ہو سکا۔ یقینی بنائیں کہ backend چل رہا ہے اور دوبارہ کوشش کریں۔'
        : 'Could not connect to the AI server. Make sure the backend is running and try again.')
    } finally {
      clearTimeout(wakeupTimer.current)
      setShowWakeup(false)
      setLoading(false)
    }
  }

  const handleClearHistory = () => {
    if (window.confirm(lang === 'ur' ? 'کیا آپ تمام تاریخ مٹانا چاہتے ہیں؟' : 'Clear all scan history?')) {
      clearHistory()
      setHistory([])
      setStats({ total: 0, phishing: 0, suspicious: 0, safe: 0 })
    }
  }

  const T = {
    en: {
      scanTitle: 'Scan a Suspicious Message, Email or URL',
      scanSub: 'Paste the message, email content or URL below and our AI will analyze it instantly.',
      aiPowered: 'AI Powered',
      analyzeBtn: '🛡️ Analyze Now',
      last5: 'Last 5 Analyses',
      historyTitle: 'Scan History',
      historySub: 'All your previous scans stored locally on your device.',
      clearAll: '🗑 Clear All',
      allScans: 'All Scans',
      errorTitle: '⚠️ Connection Error',
      statScanned: 'Total Scans',
      statPhishing: 'Phishing Detected',
      statSafe: 'Safe Messages',
    },
    ur: {
      scanTitle: 'مشکوک پیغام، ای میل یا URL اسکین کریں',
      scanSub: 'نیچے پیغام، ای میل یا URL پیسٹ کریں اور ہماری AI فوری تجزیہ کرے گی۔',
      aiPowered: 'AI طاقت سے',
      analyzeBtn: '🛡️ ابھی تجزیہ کریں',
      last5: 'آخری 5 تجزیے',
      historyTitle: 'اسکین کی تاریخ',
      historySub: 'آپ کے تمام پرانے اسکین آپ کے آلے پر محفوظ ہیں۔',
      clearAll: '🗑 سب مٹائیں',
      allScans: 'تمام اسکین',
      errorTitle: '⚠️ کنکشن خرابی',
      statScanned: 'کل اسکین',
      statPhishing: 'فشنگ پکڑی گئی',
      statSafe: 'محفوظ پیغامات',
    },
  }
  const L = T[lang]

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar activePage={activePage} setActivePage={setActivePage} lang={lang} setLang={setLang} />

      {loading && <LoadingSpinner lang={lang} showWakeup={showWakeup} />}

      <main className="ml-[220px] flex-1 p-7 overflow-y-auto min-h-screen">

        {/* ── SCAN PAGE ── */}
        {activePage === 'scan' && (
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className={`text-2xl font-extrabold text-slate-900 tracking-tight ${lang === 'ur' ? 'font-urdu' : ''}`}>
                  {L.scanTitle}
                </h1>
                <p className={`text-sm text-slate-500 mt-1.5 ${lang === 'ur' ? 'font-urdu' : ''}`}>{L.scanSub}</p>
              </div>
              <div className="flex items-center gap-1.5 text-[11.5px] font-bold text-[#01411C] bg-[#e8f5ee] border border-[#d0ead9] px-3 py-1.5 rounded-full flex-shrink-0 ml-4">
                <span className="w-2 h-2 rounded-full bg-[#01411C] ai-pulse"></span>
                <span className={lang === 'ur' ? 'font-urdu' : ''}>{L.aiPowered}</span>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { icon: '🛡️', iconBg: 'bg-[#e8f5ee]', num: stats.total, label: L.statScanned },
                { icon: '⚠️', iconBg: 'bg-red-50', num: stats.phishing, label: L.statPhishing },
                { icon: '✅', iconBg: 'bg-green-50', num: stats.safe, label: L.statSafe },
              ].map(({ icon, iconBg, num, label }) => (
                <div key={label} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3 shadow-sm">
                  <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center text-xl flex-shrink-0`}>{icon}</div>
                  <div>
                    <div className="text-2xl font-extrabold text-slate-900 leading-none">{num}</div>
                    <div className={`text-[11.5px] text-slate-500 mt-0.5 ${lang === 'ur' ? 'font-urdu' : ''}`}>{label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Scanner Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-5 shadow-sm">
              <ModeSelector mode={mode} setMode={setMode} lang={lang} />
              <InputForm value={inputText} onChange={setInputText} mode={mode} lang={lang} />
              <DemoButtons onLoad={handleDemoLoad} lang={lang} />
              <div className="flex justify-end items-center gap-3">
                {error && (
                  <div className={`text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 max-w-xs ${lang === 'ur' ? 'font-urdu text-right' : ''}`}>
                    {error}
                  </div>
                )}
                <button
                  onClick={handleAnalyze}
                  disabled={loading || !inputText.trim()}
                  className={`flex items-center gap-2 bg-[#01411C] text-white px-6 py-3 rounded-xl text-[14.5px] font-bold hover:bg-[#015c28] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 shadow-sm ${lang === 'ur' ? 'font-urdu' : ''}`}
                >
                  {L.analyzeBtn}
                </button>
              </div>
            </div>

            {/* Results */}
            {result && (
              <div className="fade-in">
                <ResultCard result={result} lang={lang} />
                <ThreatBreakdown threats={result.threats} lang={lang} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                  <AIExplanation result={result} lang={lang} />
                  <PTAComplaint result={result} lang={lang} />
                </div>
              </div>
            )}

            {/* Last 5 History */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className={`text-[15px] font-bold text-slate-800 mb-4 ${lang === 'ur' ? 'font-urdu text-right' : ''}`}>
                {L.last5}
              </h3>
              <HistoryLog history={history} lang={lang} limit={5} />
            </div>
          </div>
        )}

        {/* ── HISTORY PAGE ── */}
        {activePage === 'history' && (
          <div className="max-w-5xl mx-auto">
            <div className="mb-6">
              <h1 className={`text-2xl font-extrabold text-slate-900 tracking-tight ${lang === 'ur' ? 'font-urdu' : ''}`}>
                {L.historyTitle}
              </h1>
              <p className={`text-sm text-slate-500 mt-1.5 ${lang === 'ur' ? 'font-urdu' : ''}`}>{L.historySub}</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-[15px] font-bold text-slate-800 ${lang === 'ur' ? 'font-urdu' : ''}`}>{L.allScans}</h3>
                <button
                  onClick={handleClearHistory}
                  className={`text-xs text-red-500 font-bold hover:text-red-700 transition-colors ${lang === 'ur' ? 'font-urdu' : ''}`}
                >
                  {L.clearAll}
                </button>
              </div>
              <HistoryLog history={history} lang={lang} />
            </div>
          </div>
        )}

        {/* ── HOW IT WORKS PAGE ── */}
        {activePage === 'how' && <HowItWorksPage lang={lang} />}

        {/* ── REPORT PAGE ── */}
        {activePage === 'report' && <ReportPage lang={lang} />}

        {/* ── ABOUT PAGE ── */}
        {activePage === 'about' && <AboutPage lang={lang} />}

      </main>
    </div>
  )
}

/* ─── Sub-Pages ─────────────────────────────────────── */

function HowItWorksPage({ lang }) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className={`text-2xl font-extrabold text-slate-900 ${lang === 'ur' ? 'font-urdu' : ''}`}>
          {lang === 'ur' ? 'یہ کیسے کام کرتا ہے' : 'How It Works'}
        </h1>
        <p className={`text-sm text-slate-500 mt-1.5 ${lang === 'ur' ? 'font-urdu' : ''}`}>
          {lang === 'ur' ? 'CivicGuard ڈیجیٹل خطرات کا پتہ لگانے کے لیے دوہری AI پائپ لائن استعمال کرتا ہے۔' : 'CivicGuard uses a dual-AI pipeline to detect and explain digital threats.'}
        </p>
      </div>

      {/* Steps */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-5 shadow-sm">
        <h3 className={`text-[15px] font-bold text-slate-800 mb-6 ${lang === 'ur' ? 'font-urdu text-right' : ''}`}>
          {lang === 'ur' ? 'ہماری AI پائپ لائن' : 'Our AI Detection Pipeline'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { num: '1', title: { en: 'Paste the Message', ur: 'پیغام پیسٹ کریں' }, desc: { en: 'Copy any suspicious SMS, email, or URL and paste it into the scanner.', ur: 'کوئی بھی مشکوک SMS، ای میل، یا URL کاپی کریں اور اسکینر میں پیسٹ کریں۔' } },
            { num: '2', title: { en: 'Dual AI Analysis', ur: 'دوہری AI تجزیہ' }, desc: { en: 'BERT model for text + URL classifier for links. Both run simultaneously.', ur: 'متن کے لیے BERT ماڈل + لنکس کے لیے URL کلاسیفائر۔ دونوں بیک وقت چلتے ہیں۔' } },
            { num: '3', title: { en: 'Plain Language Result', ur: 'سادہ زبان میں نتیجہ' }, desc: { en: 'Llama 3 generates a clear explanation in Urdu or English with actionable steps.', ur: 'Llama 3 اردو یا انگریزی میں واضح وضاحت اور قابل عمل اقدامات تیار کرتا ہے۔' } },
          ].map(({ num, title, desc }) => (
            <div key={num} className="text-center px-4">
              <div className="w-11 h-11 rounded-full bg-[#01411C] text-white text-lg font-extrabold flex items-center justify-center mx-auto mb-3">{num}</div>
              <div className={`text-[14px] font-bold text-slate-800 mb-2 ${lang === 'ur' ? 'font-urdu' : ''}`}>{title[lang]}</div>
              <div className={`text-[12.5px] text-slate-500 leading-relaxed ${lang === 'ur' ? 'font-urdu' : ''}`}>{desc[lang]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* What We Check */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <h3 className={`text-[15px] font-bold text-slate-800 mb-5 ${lang === 'ur' ? 'font-urdu text-right' : ''}`}>
          {lang === 'ur' ? 'ہم کیا جانچتے ہیں' : 'What We Check'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: '👤', title: { en: 'Suspicious Sender', ur: 'مشکوک بھیجنے والا' }, desc: { en: 'We verify if the sender domain matches known legitimate sources like NADRA, FBR, banks.', ur: 'ہم تصدیق کرتے ہیں کہ بھیجنے والے کا ڈومین معروف ذرائع سے میل کھاتا ہے۔' } },
            { icon: '🔗', title: { en: 'Malicious Links', ur: 'نقصان دہ لنکس' }, desc: { en: 'URLs run through a dedicated phishing URL classifier trained on millions of examples.', ur: 'URLs کو ایک خاص فشنگ URL کلاسیفائر سے گزارا جاتا ہے۔' } },
            { icon: '⏰', title: { en: 'Urgency Tactics', ur: 'فوریت کی حکمت عملی' }, desc: { en: 'Messages pressuring you to "act immediately" or threatening consequences are flagged.', ur: 'فوری کارروائی کا دباؤ ڈالنے والے پیغامات کو نشان زد کیا جاتا ہے۔' } },
            { icon: '🔐', title: { en: 'Personal Info Requests', ur: 'ذاتی معلومات کی درخواست' }, desc: { en: 'Any request for CNIC, passwords, OTP, or bank details triggers a red flag.', ur: 'CNIC، پاس ورڈ، OTP، یا بینک تفصیلات کی کوئی بھی درخواست خطرے کی علامت ہے۔' } },
            { icon: '🗣️', title: { en: 'Language Patterns', ur: 'زبان کے نمونے' }, desc: { en: 'Unusual phrasing, grammar errors, or suspicious Urdu/English mixing are analyzed.', ur: 'غیر معمولی الفاظ، گرامر کی غلطیاں، یا مشکوک اردو/انگریزی اختلاط کا تجزیہ۔' } },
            { icon: '🧠', title: { en: 'Groq AI Explanation', ur: 'Groq AI وضاحت' }, desc: { en: 'Llama 3 synthesizes all findings into a plain-language explanation for everyday citizens.', ur: 'Llama 3 تمام نتائج کو سادہ زبان میں وضاحت میں تبدیل کرتا ہے۔' } },
          ].map(({ icon, title, desc }) => (
            <div key={title.en} className="flex gap-3 p-4 bg-slate-50 rounded-xl">
              <span className="text-2xl flex-shrink-0">{icon}</span>
              <div>
                <div className={`text-[13.5px] font-bold text-slate-800 mb-1 ${lang === 'ur' ? 'font-urdu' : ''}`}>{title[lang]}</div>
                <div className={`text-[12px] text-slate-500 leading-relaxed ${lang === 'ur' ? 'font-urdu' : ''}`}>{desc[lang]}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ReportPage({ lang }) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className={`text-2xl font-extrabold text-slate-900 ${lang === 'ur' ? 'font-urdu' : ''}`}>
          {lang === 'ur' ? 'اسکام رپورٹ کریں' : 'Report a Scam'}
        </h1>
        <p className={`text-sm text-slate-500 mt-1.5 ${lang === 'ur' ? 'font-urdu' : ''}`}>
          {lang === 'ur' ? 'دوسرے پاکستانیوں کی حفاظت کریں — PTA کو اسکام رپورٹ کریں' : 'Help protect other Pakistanis by reporting scams to PTA.'}
        </p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-4">
        {[
          { icon: '📞', title: { en: 'PTA Helpline', ur: 'PTA ہیلپ لائن' }, desc: { en: 'Call 0800-55055 (toll-free) to report any telecom fraud or suspicious calls.', ur: '0800-55055 (مفت) پر کال کریں کسی بھی ٹیلی کام دھوکے کی رپورٹ کے لیے۔' } },
          { icon: '🌐', title: { en: 'Online Portal', ur: 'آن لائن پورٹل' }, desc: { en: 'File a complaint at pta.gov.pk/complaint with full details.', ur: 'pta.gov.pk/complaint پر مکمل تفصیل کے ساتھ شکایت درج کریں۔' } },
          { icon: '✉️', title: { en: 'SMS Reporting', ur: 'SMS رپورٹنگ' }, desc: { en: 'Forward spam SMS to 9000 — a free PTA service to report SMS scams instantly.', ur: 'اسپام SMS کو 9000 پر فارورڈ کریں — PTA کی مفت فوری رپورٹنگ سروس۔' } },
          { icon: '🛡️', title: { en: 'Use CivicGuard', ur: 'CivicGuard استعمال کریں' }, desc: { en: 'Scan first — we auto-generate a PTA complaint draft with all threat details!', ur: 'پہلے اسکین کریں — ہم تمام تفصیل کے ساتھ خودکار PTA شکایت تیار کرتے ہیں!' } },
        ].map(({ icon, title, desc }) => (
          <div key={title.en} className="flex gap-4 p-5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-3xl flex-shrink-0">{icon}</span>
            <div>
              <div className={`text-[14px] font-bold text-slate-800 mb-1 ${lang === 'ur' ? 'font-urdu' : ''}`}>{title[lang]}</div>
              <div className={`text-[13px] text-slate-500 leading-relaxed ${lang === 'ur' ? 'font-urdu' : ''}`}>{desc[lang]}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AboutPage({ lang }) {
  const roadmap = [
    { en: '📸 Screenshot Upload Analysis', ur: '📸 اسکرین شاٹ اپ لوڈ تجزیہ' },
    { en: '💬 WhatsApp Message Detection', ur: '💬 واٹس ایپ پیغام کا پتہ لگانا' },
    { en: '🔊 Voice Scam Detection', ur: '🔊 آواز اسکام کا پتہ لگانا' },
    { en: '🤝 Full PTA API Integration', ur: '🤝 مکمل PTA API انضمام' },
    { en: '🌐 Browser Extension', ur: '🌐 براؤزر ایکسٹینشن' },
    { en: '📱 Mobile App (iOS & Android)', ur: '📱 موبائل ایپ (iOS & Android)' },
    { en: '📊 Scam Trends Dashboard', ur: '📊 اسکام ٹرینڈز ڈیش بورڈ' },
    { en: '🏘️ Community Reporting System', ur: '🏘️ کمیونٹی رپورٹنگ سسٹم' },
  ]
  const stack = [
    { icon: '⚛️', name: 'React + Tailwind', desc: { en: 'Modern frontend deployed on Vercel.', ur: 'Vercel پر تعینات جدید فرنٹ اینڈ۔' } },
    { icon: '🐍', name: 'Python + FastAPI', desc: { en: 'Backend API deployed on Render.', ur: 'Render پر تعینات backend API۔' } },
    { icon: '🤗', name: 'HuggingFace BERT', desc: { en: 'Phishing text + URL detection models.', ur: 'فشنگ متن + URL کا پتہ لگانے کے ماڈل۔' } },
    { icon: '⚡', name: 'Groq + Llama 3', desc: { en: 'Ultra-fast AI explanations in Urdu & English.', ur: 'اردو اور انگریزی میں انتہائی تیز AI وضاحت۔' } },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#0A2A66] to-[#0d3580] rounded-2xl p-8 text-white mb-5 shadow-lg">
        <h2 className="text-2xl font-extrabold mb-2">🛡️ CivicGuard</h2>
        <p className={`text-sm text-white/80 leading-relaxed max-w-xl ${lang === 'ur' ? 'font-urdu' : ''}`}>
          {lang === 'ur'
            ? 'پاکستان کی پہلی AI سے چلنے والی ڈیجیٹل اسکام سے حفاظت کی ڈھال۔ ہر اس شہری کے لیے بنائی گئی جو جاننا چاہتا ہے کہ ملنے والا پیغام اصلی ہے یا جال۔'
            : "Pakistan's first AI-powered shield against digital scams. Built for everyday citizens who deserve to know if the message they received is real or a trap."}
        </p>
        <div className="mt-4 inline-block bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-xs font-bold">
          🏆 AI for Civic Innovation Hackathon 2026
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className={`text-[15px] font-bold text-slate-800 mb-3 ${lang === 'ur' ? 'font-urdu text-right' : ''}`}>
            {lang === 'ur' ? 'مسئلہ' : 'The Problem'}
          </h3>
          <p className={`text-[13px] text-slate-600 leading-relaxed ${lang === 'ur' ? 'font-urdu text-right' : ''}`}>
            {lang === 'ur'
              ? 'لاکھوں پاکستانی ہر روز جعلی NADRA، FBR، اور بینک پیغامات وصول کرتے ہیں۔ یہ فشنگ حملے CNIC تفصیلات، بینک اکاؤنٹس چراتے ہیں۔'
              : 'Millions of Pakistanis receive fake NADRA, FBR, and bank messages daily. These phishing attacks steal CNIC details, bank credentials, and money from people who cannot tell what\'s real.'}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className={`text-[15px] font-bold text-slate-800 mb-3 ${lang === 'ur' ? 'font-urdu text-right' : ''}`}>
            {lang === 'ur' ? 'ہمارا حل' : 'Our Solution'}
          </h3>
          <p className={`text-[13px] text-slate-600 leading-relaxed ${lang === 'ur' ? 'font-urdu text-right' : ''}`}>
            {lang === 'ur'
              ? 'کوئی بھی مشکوک پیغام پیسٹ کریں — ہماری دوہری AI پائپ لائن 3 سیکنڈ سے کم میں خطرے کا پتہ لگاتی اور اردو یا انگریزی میں وضاحت کرتی ہے۔'
              : 'Paste any suspicious message → our dual-AI pipeline detects the threat and explains it in plain Urdu or English in under 3 seconds. No technical knowledge required.'}
          </p>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-5">
        <h3 className={`text-[15px] font-bold text-slate-800 mb-4 ${lang === 'ur' ? 'font-urdu text-right' : ''}`}>
          {lang === 'ur' ? 'ٹیک اسٹیک' : 'Tech Stack'}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {stack.map(({ icon, name, desc }) => (
            <div key={name} className="flex gap-3 p-3.5 bg-slate-50 rounded-xl">
              <span className="text-2xl flex-shrink-0">{icon}</span>
              <div>
                <div className="text-[13px] font-bold text-slate-800">{name}</div>
                <div className={`text-[11.5px] text-slate-500 ${lang === 'ur' ? 'font-urdu' : ''}`}>{desc[lang]}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Roadmap */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-5">
        <h3 className={`text-[15px] font-bold text-slate-800 mb-4 ${lang === 'ur' ? 'font-urdu text-right' : ''}`}>
          {lang === 'ur' ? 'مستقبل کا روڈ میپ' : 'Future Roadmap'}
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          {roadmap.map((item) => (
            <div key={item.en} className={`p-3 bg-slate-50 rounded-xl text-[12.5px] text-slate-700 font-medium ${lang === 'ur' ? 'font-urdu text-right' : ''}`}>
              {item[lang]}
            </div>
          ))}
        </div>
      </div>

      <div className="text-center text-xs text-slate-400 pb-6">
        © 2026 CivicGuard. All rights reserved. · Built for AI for Civic Innovation Hackathon 2026
      </div>
    </div>
  )
}
