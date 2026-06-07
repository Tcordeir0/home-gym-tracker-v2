import { useState } from 'react'
import { Trash2, Flame, Ruler, TrendingUp } from 'lucide-react'
import { Modal } from './ui/Modal'
import { useStore, totalPoints, todayISO } from '@/store'
import { statsFor } from '@/lib/game'
import { cn } from '@/lib/utils'

const MONTHS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
const DOW = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

function iso(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
function fmtDate(s: string) {
  const p = s.split('-')
  return `${p[2]}/${p[1]}/${p[0]}`
}
function Stat({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border border-line bg-surface px-2 py-3.5 text-center">
      <div className="font-display text-2xl leading-none text-accent">{value}</div>
      <div className="mt-1.5 truncate text-[10px] font-bold uppercase tracking-wide text-muted">{label}</div>
    </div>
  )
}

export function HistoryModal({
  open,
  onClose,
  onOpenMeasures,
  onOpenCharts,
  onOpenManual,
}: {
  open: boolean
  onClose: () => void
  onOpenMeasures: () => void
  onOpenCharts: () => void
  onOpenManual: () => void
}) {
  const active = useStore((s) => s.profiles.find((p) => p.id === s.activeId)!)
  const activeId = useStore((s) => s.activeId)
  const history = useStore((s) => s.history[s.activeId]) ?? []
  const scores = useStore((s) => s.scores)
  const deleteEntry = useStore((s) => s.deleteEntry)
  const [expanded, setExpanded] = useState<number | null>(null)

  const today = new Date()
  const ym = todayISO().slice(0, 7)
  const monthCount = history.filter((e) => e.date.slice(0, 7) === ym).length
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 6)
  const weekAgoStr = iso(weekAgo)
  const weekCount = history.filter((e) => e.date >= weekAgoStr).length
  const streak = statsFor(history, 0, active.freezes ?? 0).streak

  const y = today.getFullYear()
  const m = today.getMonth()
  const first = new Date(y, m, 1).getDay()
  const daysInMonth = new Date(y, m + 1, 0).getDate()
  const monthKey = `${y}-${String(m + 1).padStart(2, '0')}`
  const marked = new Set(history.filter((e) => e.date.slice(0, 7) === monthKey).map((e) => parseInt(e.date.slice(8), 10)))
  const todayStr = todayISO()

  const sorted = history
    .map((e, i) => ({ e, i }))
    .sort((a, b) => (a.e.date < b.e.date ? 1 : a.e.date > b.e.date ? -1 : b.i - a.i))

  return (
    <Modal open={open} onClose={onClose} title={`Histórico — ${active.name}`}>
      <div className="text-center">
        <div className="font-display text-5xl leading-none text-accent">{totalPoints(scores, activeId)}</div>
        <div className="mt-1 text-[11px] font-bold uppercase tracking-wider text-muted">pontos de {active.name}</div>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2">
        <Stat value={history.length} label="Total" />
        <Stat value={monthCount} label="Mês" />
        <Stat value={weekCount} label="7 dias" />
        <div className="min-w-0 overflow-hidden rounded-2xl border border-line bg-surface px-2 py-3.5 text-center">
          <div className="flex items-center justify-center gap-1 font-display text-2xl leading-none text-accent">
            <Flame size={18} />
            {streak}
          </div>
          <div className="mt-1.5 truncate text-[10px] font-bold uppercase tracking-wide text-muted">sequência</div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-line bg-surface p-3">
        <div className="mb-2 text-center font-bold">{MONTHS[m]} {y}</div>
        <div className="grid grid-cols-7 gap-1">
          {DOW.map((d, i) => (
            <div key={i} className="text-center text-[11px] font-bold text-muted">{d}</div>
          ))}
          {Array.from({ length: first }).map((_, i) => (
            <div key={`e${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const d = idx + 1
            const has = marked.has(d)
            const isToday = `${monthKey}-${String(d).padStart(2, '0')}` === todayStr
            return (
              <div
                key={d}
                className={cn(
                  'relative grid aspect-square place-items-center rounded-lg text-xs',
                  has ? 'bg-accent/15 font-bold text-fg' : 'text-muted',
                  isToday && 'outline outline-1 outline-line',
                )}
              >
                {d}
                {has && <span className="absolute bottom-1 h-1.5 w-1.5 rounded-full bg-accent" />}
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          onClick={onOpenMeasures}
          className="flex items-center justify-center gap-2 rounded-xl border border-line bg-surface py-3 text-sm font-bold text-fg"
        >
          <Ruler size={16} /> Medidas
        </button>
        <button
          onClick={onOpenCharts}
          className="flex items-center justify-center gap-2 rounded-xl border border-line bg-surface py-3 text-sm font-bold text-fg"
        >
          <TrendingUp size={16} /> Gráficos
        </button>
      </div>
      <button
        onClick={onOpenManual}
        className="mt-2 w-full rounded-xl border border-line bg-surface py-3 text-sm font-bold text-fg"
      >
        ＋ Registrar sessão (outra data)
      </button>

      <h3 className="mb-2 mt-5 text-xs font-bold uppercase tracking-wider text-muted">Sessões registradas</h3>
      {sorted.length === 0 ? (
        <div className="rounded-xl border border-line bg-surface p-6 text-center text-sm text-muted">
          Nenhum treino registrado ainda.<br />Conclua um treino pra começar! 💪
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {sorted.map(({ e, i }) => {
            const detail = e.exercises
              ?.map((x) => `${x.nome} ${x.sets.map((s) => `${s.kg != null ? s.kg + 'kg' : ''}${s.kg != null && s.reps != null ? '×' : ''}${s.reps ?? ''}`).filter(Boolean).join(' · ')}`)
              .join('\n')
            return (
              <div key={i}>
                <div
                  className={cn('flex items-center gap-3 rounded-xl border border-line bg-surface p-3', detail && 'cursor-pointer')}
                  onClick={() => detail && setExpanded(expanded === i ? null : i)}
                >
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent font-extrabold text-on-accent">
                    {e.w === 'cardio' ? '🏃' : e.w}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] text-muted">{fmtDate(e.date)}</div>
                    <div className="font-bold">{e.w === 'cardio' ? `Cardio · ${e.t ?? ''}` : `Treino ${e.w}`}</div>
                  </div>
                  <button
                    onClick={(ev) => {
                      ev.stopPropagation()
                      deleteEntry(activeId, i)
                    }}
                    aria-label="Remover"
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line bg-surface text-muted"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                {detail && expanded === i && (
                  <div className="mt-px whitespace-pre-line rounded-b-xl border border-t-0 border-line bg-surface2 px-3 py-2 text-xs leading-relaxed text-muted">
                    {detail}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </Modal>
  )
}
