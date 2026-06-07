import { useState } from 'react'
import { Modal } from './ui/Modal'
import { LineChart, type Point } from './ui/LineChart'
import { useStore } from '@/store'
import { cn } from '@/lib/utils'
import type { MeasureField } from '@/types'

const MFIELDS: { k: MeasureField; label: string; unit: string }[] = [
  { k: 'weight', label: 'Peso', unit: 'kg' },
  { k: 'arm', label: 'Braço', unit: 'cm' },
  { k: 'chest', label: 'Peito', unit: 'cm' },
  { k: 'waist', label: 'Cintura', unit: 'cm' },
]
const h3Cls = 'mb-2 mt-5 text-xs font-bold uppercase tracking-wider text-muted first:mt-0'
const emptyCls = 'rounded-xl border border-line bg-surface2 p-6 text-center text-sm text-muted'
const selectCls = 'w-full rounded-xl border border-line bg-surface2 px-3.5 py-3 text-fg outline-none focus:border-accent'

export function ChartsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const active = useStore((s) => s.profiles.find((p) => p.id === s.activeId)!)
  const history = useStore((s) => s.history[s.activeId]) ?? []
  const measures = useStore((s) => s.measures[s.activeId]) ?? []

  const [exSel, setExSel] = useState('')
  const [mField, setMField] = useState<MeasureField>('arm')

  const exSet = new Set<string>()
  history.forEach((e) => e.exercises?.forEach((x) => x.sets.some((s) => s.kg != null) && exSet.add(x.nome)))
  const exNames = [...exSet]
  const curEx = exNames.includes(exSel) ? exSel : (exNames[0] ?? '')

  function loadSeries(nome: string): Point[] {
    const out: Point[] = []
    history.forEach((e) => {
      const ex = e.exercises?.find((x) => x.nome === nome)
      if (!ex) return
      let best: number | null = null
      for (const s of ex.sets) if (s.kg != null && (best == null || s.kg > best)) best = s.kg
      if (best != null) out.push({ x: e.date, y: best })
    })
    return out.sort((a, b) => (a.x < b.x ? -1 : 1))
  }

  function measureSeries(field: MeasureField): Point[] {
    return [...measures]
      .sort((a, b) => (a.date < b.date ? -1 : 1))
      .filter((m) => m[field] != null)
      .map((m) => ({ x: m.date, y: m[field]! }))
  }

  const availM = MFIELDS.filter((f) => measures.some((m) => m[f.k] != null))
  const curM = availM.some((f) => f.k === mField) ? mField : availM[0]?.k

  return (
    <Modal open={open} onClose={onClose} title={`Evolução — ${active.name}`}>
      <h3 className={h3Cls}>Carga por exercício</h3>
      {exNames.length ? (
        <>
          <select value={curEx} onChange={(e) => setExSel(e.target.value)} className={selectCls}>
            {exNames.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <div className="mt-2">
            <LineChart key={`ex-${curEx}`} data={loadSeries(curEx)} unit="kg" />
          </div>
        </>
      ) : (
        <div className={emptyCls}>Registre a carga nos treinos pra ver a evolução 🏋️</div>
      )}

      <h3 className={h3Cls}>Medidas</h3>
      {availM.length && curM ? (
        <>
          <div className="mb-2 flex flex-wrap gap-1.5">
            {availM.map((f) => (
              <button
                key={f.k}
                onClick={() => setMField(f.k)}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-xs font-bold transition-colors',
                  curM === f.k ? 'border-accent bg-accent text-on-accent' : 'border-line bg-surface2 text-muted',
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          <LineChart
            key={`m-${curM}`}
            data={measureSeries(curM)}
            unit={MFIELDS.find((f) => f.k === curM)?.unit ?? ''}
          />
        </>
      ) : (
        <div className={emptyCls}>Registre medidas pra ver os gráficos 📏</div>
      )}
    </Modal>
  )
}
