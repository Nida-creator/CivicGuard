import React from 'react'

export default function LoadingSpinner({ lang, showWakeup }) {
  const msgs = {
    en: {
      analyzing: 'Analyzing content...',
      pipeline: 'Running dual AI detection pipeline',
      wakeup: '⏳ Server is waking up from sleep, this may take 30–60 seconds on first request...',
      steps: ['Checking with HuggingFace BERT model...', 'Scanning for malicious URLs...', 'Generating Llama 3 explanation...', 'Combining results...'],
    },
    ur: {
      analyzing: 'مواد کا تجزیہ ہو رہا ہے...',
      pipeline: 'دوہری AI پائپ لائن چل رہی ہے',
      wakeup: '⏳ سرور جاگ رہا ہے، پہلی درخواست میں 30-60 سیکنڈ لگ سکتے ہیں...',
      steps: ['HuggingFace BERT ماڈل چیک ہو رہا ہے...', 'نقصاندہ URLs اسکین ہو رہے ہیں...', 'Llama 3 وضاحت بن رہی ہے...', 'نتائج جمع ہو رہے ہیں...'],
    },
  }
  const L = msgs[lang]

  return (
    <div className="fixed inset-0 bg-[#0A2A66]/60 backdrop-blur-sm z-[200] flex items-center justify-center">
      <div className="bg-white rounded-2xl p-10 text-center shadow-2xl max-w-sm w-full mx-4">
        <div className="w-14 h-14 border-4 border-slate-200 border-t-[#01411C] rounded-full spin mx-auto mb-5"></div>
        <div className={`text-base font-bold text-slate-800 mb-1 ${lang === 'ur' ? 'font-urdu' : ''}`}>{L.analyzing}</div>
        <div className={`text-xs text-slate-400 mb-4 ${lang === 'ur' ? 'font-urdu' : ''}`}>{L.pipeline}</div>
        <div className="space-y-2">
          {L.steps.map((step, i) => (
            <div key={i} className={`text-xs text-slate-500 flex items-center gap-2 ${lang === 'ur' ? 'font-urdu flex-row-reverse' : ''}`}>
              <div className="w-1.5 h-1.5 rounded-full bg-[#01411C] ai-pulse flex-shrink-0"></div>
              {step}
            </div>
          ))}
        </div>
        {showWakeup && (
          <div className={`mt-4 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-2.5 leading-relaxed ${lang === 'ur' ? 'font-urdu' : ''}`}>
            {L.wakeup}
          </div>
        )}
      </div>
    </div>
  )
}
