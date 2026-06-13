import React from 'react'

const DEMOS = {
  nadra: {
    mode: 'sms',
    text: 'NADRA Alert: Apka CNIC expire ho raha hai. Kal tak update karnay ke liye is link par click karain: http://nadra-gov-update.com/verify?id=49823',
  },
  fbr: {
    mode: 'email',
    text: 'FBR Tax Refund Notification\n\nDear Taxpayer,\n\nYou are eligible for a tax refund of Rs. 45,000. To claim your refund immediately, verify your NTN and bank account details at: http://fbr-refund.net/claim?ntn=74832\n\nThis offer expires in 24 hours. Failure to respond will result in cancellation.\n\nFederal Board of Revenue\nIslamabad',
  },
  bank: {
    mode: 'sms',
    text: 'Meezan Bank: Apka account suspend kar diya gaya hai. Apni account ko restore karne ke liye abhi verify karein: http://meezan-secure.co/verify?acc=1234 - Yeh link 2 ghante mein expire ho jaye ga.',
  },
  url: {
    mode: 'url',
    text: 'http://nadra.gov-update.com/cnic-verify?urgent=true&session=abc123',
  },
}

export default function DemoButtons({ onLoad, lang }) {
  const labels = {
    en: {
      try: 'Try an example:',
      nadra: 'Fake NADRA SMS',
      fbr: 'Fake FBR Email',
      bank: 'Fake Bank SMS',
      url: 'Suspicious URL',
    },
    ur: {
      try: 'مثال آزمائیں:',
      nadra: 'جعلی NADRA SMS',
      fbr: 'جعلی FBR ای میل',
      bank: 'جعلی بینک SMS',
      url: 'مشکوک URL',
    },
  }
  const L = labels[lang]

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className={`text-xs text-slate-500 font-semibold mr-1 ${lang === 'ur' ? 'font-urdu' : ''}`}>
        {L.try}
      </span>
      {[
        { key: 'nadra', label: L.nadra },
        { key: 'fbr', label: L.fbr },
        { key: 'bank', label: L.bank },
        { key: 'url', label: L.url },
      ].map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onLoad(DEMOS[key])}
          className={`px-3 py-1.5 rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:border-[#01411C] hover:text-[#01411C] hover:bg-[#e8f5ee] transition-all duration-150 ${lang === 'ur' ? 'font-urdu' : ''}`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
