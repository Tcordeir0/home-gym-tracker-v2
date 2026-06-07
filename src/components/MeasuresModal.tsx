import { useRef, useState } from 'react'
import { Trash2, Image as ImageIcon } from 'lucide-react'
import { Modal } from './ui/Modal'
import { useStore } from '@/store'
import { resizePhoto } from '@/lib/image'
import { useToast } from '@/lib/toast'
import { cn } from '@/lib/utils'
import type { Measure, MeasureField } from '@/types'

const FIELDS: { k: MeasureField; label: string; unit: string; better: 'up' | 'down' | null }[] = [
  { k: 'weight', label: 'Peso', unit: 'kg', better: null },
  { k: 'arm', label: 'Braço', unit: 'cm', better: 'up' },
  { k: 'chest', label: 'Peito', unit: 'cm', better: 'up' },
  { k: 'waist', label: 'Cintura', unit: 'cm', better: 'down' },
]

const fmtNum = (n: number) => (Math.round(n * 10) / 10).toString()
const fmtDate = (s: string) => {
  const p = s.split('-')
  return `${p[2]}/${p[1]}/${p[0]}`
}
const todayISO = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const inputCls =
  'w-full min-w-0 rounded-xl border border-line bg-surface2 px-3.5 py-3 text-fg outline-none focus:border-accent'
const h3Cls = 'mb-2 mt-5 text-xs font-bold uppercase tracking-wider text-muted'

export function MeasuresModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const active = useStore((s) => s.profiles.find((p) => p.id === s.activeId)!)
  const activeId = useStore((s) => s.activeId)
  const measures = useStore((s) => s.measures[s.activeId]) ?? []
  const addMeasure = useStore((s) => s.addMeasure)
  const deleteMeasure = useStore((s) => s.deleteMeasure)
  const show = useToast((s) => s.show)
  const fileRef = useRef<HTMLInputElement>(null)

  const [date, setDate] = useState(todayISO())
  const [vals, setVals] = useState<Record<MeasureField, string>>({ weight: '', arm: '', chest: '', waist: '' })
  const [photo, setPhoto] = useState<string | null>(null)
  const [viewPhoto, setViewPhoto] = useState<string | null>(null)

  const sorted = [...measures].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
  const cur = sorted[sorted.length - 1]
  const prev = sorted[sorted.length - 2]

  async function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) {
      try {
        setPhoto(await resizePhoto(f))
      } catch {
        show('Imagem inválida ❌')
      }
    }
    e.target.value = ''
  }

  function save() {
    if (date > todayISO()) {
      show('Não dá pra registrar no futuro')
      return
    }
    const m: Measure = { date }
    let any = false
    for (const f of FIELDS) {
      const v = vals[f.k]
      if (v !== '' && !Number.isNaN(parseFloat(v))) {
        m[f.k] = parseFloat(v)
        any = true
      }
    }
    if (photo) {
      m.photo = photo
      any = true
    }
    if (!any) {
      show('Preencha pelo menos um campo')
      return
    }
    addMeasure(m)
    show('Medida salva! 📏')
    setVals({ weight: '', arm: '', chest: '', waist: '' })
    setPhoto(null)
    setDate(todayISO())
  }

  return (
    <>
      <Modal open={open} onClose={onClose} title={`Medidas — ${active.name}`}>
        {cur ? (
          <div className="grid grid-cols-4 gap-2">
            {FIELDS.map((f) => {
              const v = cur[f.k]
              let delta: React.ReactNode = null
              const pv = prev?.[f.k]
              if (pv != null && v != null && v - pv !== 0) {
                const diff = v - pv
                const good = f.better == null ? null : (diff > 0) === (f.better === 'up')
                delta = (
                  <div
                    className={cn(
                      'mt-0.5 text-[10px] font-extrabold',
                      good == null ? 'text-muted' : good ? 'text-done' : 'text-red-400',
                    )}
                  >
                    {diff > 0 ? '+' : ''}
                    {fmtNum(diff)}
                  </div>
                )
              }
              return (
                <div key={f.k} className="rounded-xl border border-line bg-surface2 px-1.5 py-2.5 text-center">
                  <div className="font-display text-xl leading-none text-accent">{v != null ? fmtNum(v) : '–'}</div>
                  <div className="mt-1 text-[9px] uppercase tracking-wide text-muted">{f.label}</div>
                  {delta}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-line bg-surface2 p-4 text-center text-sm text-muted">
            Registre sua primeira medida pra acompanhar a evolução 💪
          </div>
        )}

        <h3 className={h3Cls}>Registrar medida</h3>
        <label className="mb-1 block text-xs font-bold text-muted">Data</label>
        <input type="date" value={date} max={todayISO()} onChange={(e) => setDate(e.target.value)} className={inputCls} />
        <div className="mt-2 grid grid-cols-2 gap-2">
          {FIELDS.map((f) => (
            <div key={f.k}>
              <label className="mb-1 block text-xs font-bold text-muted">
                {f.label} ({f.unit})
              </label>
              <input
                type="number"
                inputMode="decimal"
                min={0}
                step={0.1}
                placeholder={f.unit}
                value={vals[f.k]}
                onChange={(e) => setVals((p) => ({ ...p, [f.k]: e.target.value }))}
                className={inputCls}
              />
            </div>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          {photo && <img src={photo} alt="prévia" className="h-14 w-14 rounded-xl border border-line object-cover" />}
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 rounded-xl border border-line bg-surface2 px-3.5 py-2.5 text-sm font-bold text-fg"
          >
            <ImageIcon size={16} /> Foto de progresso
          </button>
          {photo && (
            <button onClick={() => setPhoto(null)} className="rounded-xl border border-line bg-surface2 px-3.5 py-2.5 text-sm font-bold text-muted">
              Remover
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPhoto} />
        </div>

        <button onClick={save} className="mt-4 w-full rounded-xl bg-accent py-3.5 font-extrabold text-on-accent active:scale-[0.99]">
          Salvar medida
        </button>

        <h3 className={h3Cls}>Histórico de medidas</h3>
        {sorted.length === 0 ? (
          <div className="rounded-xl border border-line bg-surface2 p-4 text-center text-sm text-muted">Nenhuma medida ainda.</div>
        ) : (
          <div className="flex flex-col gap-2">
            {[...sorted].reverse().map((m) => {
              const realIdx = measures.indexOf(m)
              const valsStr = FIELDS.filter((f) => m[f.k] != null)
                .map((f) => `${f.label} ${fmtNum(m[f.k]!)}${f.unit}`)
                .join(' · ')
              return (
                <div key={realIdx} className="flex items-center gap-3 rounded-xl border border-line bg-surface p-2.5">
                  {m.photo && (
                    <img
                      src={m.photo}
                      alt="foto"
                      onClick={() => setViewPhoto(m.photo!)}
                      className="h-11 w-11 shrink-0 cursor-pointer rounded-lg object-cover"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] text-muted">{fmtDate(m.date)}</div>
                    <div className="text-sm font-bold">{valsStr || '—'}</div>
                  </div>
                  <button
                    onClick={() => deleteMeasure(activeId, realIdx)}
                    aria-label="Remover"
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line bg-surface text-muted"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </Modal>

      <Modal open={!!viewPhoto} onClose={() => setViewPhoto(null)} title="Progresso">
        {viewPhoto && <img src={viewPhoto} alt="Foto de progresso" className="w-full rounded-xl" />}
      </Modal>
    </>
  )
}
