import React, { useEffect, useRef } from 'react'

export default function ConfidenceGauge({ confidence, lang }) {
  const canvasRef = useRef(null)
  const pct = Math.round((confidence || 0) * 100)
  const color = pct >= 71 ? '#DC2626' : pct >= 41 ? '#F59E0B' : '#16A34A'
  const label = pct >= 71
    ? (lang === 'ur' ? 'اعلیٰ اعتماد' : 'High Confidence')
    : pct >= 41
    ? (lang === 'ur' ? 'درمیانہ اعتماد' : 'Medium Confidence')
    : (lang === 'ur' ? 'کم اعتماد' : 'Low Confidence')

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const cx = 90, cy = 88, r = 68
    ctx.clearRect(0, 0, 180, 100)
    // Background arc
    ctx.beginPath()
    ctx.arc(cx, cy, r, Math.PI, 2 * Math.PI)
    ctx.lineWidth = 16
    ctx.strokeStyle = '#e2e8f0'
    ctx.lineCap = 'round'
    ctx.stroke()
    // Colored arc
    const fillEnd = Math.PI + (pct / 100) * Math.PI
    ctx.beginPath()
    ctx.arc(cx, cy, r, Math.PI, fillEnd)
    ctx.lineWidth = 16
    ctx.strokeStyle = color
    ctx.lineCap = 'round'
    ctx.stroke()
  }, [pct, color])

  return (
    <div className="flex flex-col items-center">
      <canvas ref={canvasRef} width={180} height={100} className="gauge-canvas" />
      <div className="text-center -mt-2">
        <div className="text-3xl font-extrabold text-slate-900">{pct}%</div>
        <div className={`text-xs font-bold mt-0.5 ${lang === 'ur' ? 'font-urdu' : ''}`} style={{ color }}>
          {label}
        </div>
      </div>
    </div>
  )
}
