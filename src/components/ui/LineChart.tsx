import { motion } from 'motion/react'

export type Point = { x: string; y: number }

const fmtNum = (n: number) => (Math.round(n * 10) / 10).toString()
const fmtDay = (iso: string) => {
  const p = iso.split('-')
  return `${p[2]}/${p[1]}`
}

export function LineChart({ data, unit }: { data: Point[]; unit: string }) {
  if (!data.length) {
    return (
      <div className="rounded-xl border border-line bg-surface2 p-6 text-center text-sm leading-relaxed text-muted">
        Sem dados ainda.
        <br />
        Registre pra ver a evolução 📈
      </div>
    )
  }
  if (data.length === 1) {
    return (
      <div className="rounded-xl border border-line bg-surface2 p-6 text-center text-sm leading-relaxed text-muted">
        <b className="text-lg text-accent">
          {fmtNum(data[0].y)}
          {unit}
        </b>
        <br />
        em {data[0].x.split('-').reverse().join('/')}
        <br />
        <span className="text-xs">Registre mais de uma vez pra ver a linha</span>
      </div>
    )
  }

  const W = 320
  const H = 170
  const pl = 30
  const pr = 12
  const pt = 16
  const pb = 22
  const ys = data.map((d) => d.y)
  let min = Math.min(...ys)
  let max = Math.max(...ys)
  if (min === max) {
    min -= 1
    max += 1
  }
  const n = data.length
  const X = (i: number) => pl + (W - pl - pr) * (i / (n - 1))
  const Y = (v: number) => pt + (H - pt - pb) * (1 - (v - min) / (max - min))
  const line = data.map((d, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)} ${Y(d.y).toFixed(1)}`).join(' ')
  const area = `${line} L${X(n - 1).toFixed(1)} ${H - pb} L${X(0).toFixed(1)} ${H - pb} Z`
  const last = data[n - 1]

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full rounded-xl border border-line bg-surface2">
      <text x="4" y={Y(max) + 3} className="fill-muted text-[9px]">{fmtNum(max)}</text>
      <text x="4" y={Y(min) + 3} className="fill-muted text-[9px]">{fmtNum(min)}</text>
      <path d={area} className="fill-accent opacity-10" />
      <motion.path
        d={line}
        className="fill-none stroke-accent"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      />
      {data.map((d, i) => (
        <motion.circle
          key={i}
          cx={X(i)}
          cy={Y(d.y)}
          r={3.2}
          className="fill-accent"
          stroke="var(--surface-2)"
          strokeWidth={1.5}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 + i * 0.05, type: 'spring', stiffness: 400, damping: 20 }}
        />
      ))}
      <text x={pl} y={H - 6} className="fill-muted text-[9px]">{fmtDay(data[0].x)}</text>
      <text x={W - pr} y={H - 6} textAnchor="end" className="fill-muted text-[9px]">{fmtDay(last.x)}</text>
      <text x={W - pr} y={Y(last.y) - 6} textAnchor="end" className="fill-accent text-[11px] font-extrabold">
        {fmtNum(last.y)}
        {unit}
      </text>
    </svg>
  )
}
