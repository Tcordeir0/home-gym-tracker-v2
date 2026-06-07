import { Eye, Medal, Play } from 'lucide-react'
import { useStore } from '@/store'
import { useDemo } from '@/lib/demo'
import { DEMOS, ytLink } from '@/data/demos'
import { playSound, haptic } from '@/lib/feedback'
import { cn } from '@/lib/utils'
import type { Exercise, HistoryEntry, WorkoutKey } from '@/types'

function lastPerf(history: HistoryEntry[], nome: string): { kg?: number; reps?: number } | null {
  for (let i = history.length - 1; i >= 0; i--) {
    const found = history[i].exercises?.find((x) => x.nome === nome && x.sets.length)
    if (found) {
      let best = found.sets[0]
      for (const s of found.sets) if ((s.kg ?? 0) > (best.kg ?? 0)) best = s
      return best
    }
  }
  return null
}

export function ExerciseCard({
  ex,
  w,
  exIdx,
  withLoad,
}: {
  ex: Exercise
  w: WorkoutKey
  exIdx: number
  withLoad: boolean
}) {
  const activeId = useStore((s) => s.activeId)
  const session = useStore((s) => s.sessions[s.activeId]?.[w]?.[exIdx])
  const history = useStore((s) => s.history[s.activeId])
  const toggleSet = useStore((s) => s.toggleSet)
  const setSetValue = useStore((s) => s.setSetValue)
  const openDemo = useDemo((s) => s.open)

  const sets = session ?? Array.from({ length: ex.series }, () => ({ done: false }) as const)
  const lp = withLoad ? lastPerf(history ?? [], ex.nome) : null
  void activeId

  const numCls = (done: boolean) =>
    cn(
      'h-9 w-full min-w-0 rounded-[10px] border bg-surface2 text-center font-bold text-fg placeholder:font-semibold placeholder:text-muted',
      done ? 'border-done' : 'border-line',
    )

  return (
    <article className="themed-surface rounded-2xl border border-line bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-bold leading-tight">{ex.nome}</div>
          <div className="mt-0.5 text-[10px] uppercase tracking-wide text-muted">
            {ex.musculo}
          </div>
        </div>
        <div className="shrink-0 font-display text-xl text-accent">
          {ex.series}×{ex.reps}
        </div>
      </div>

      <div className="mt-3 rounded-lg bg-white/[0.04] px-3 py-2 text-xs text-muted">
        <b className="text-fg">Dica:</b> {ex.dica}
      </div>

      {lp && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-muted">
          <Medal size={14} className="text-accent" /> Última vez:{' '}
          <b className="text-accent">
            {lp.kg != null ? `${lp.kg}kg` : ''}
            {lp.kg != null && lp.reps != null ? ' × ' : ''}
            {lp.reps != null ? `${lp.reps} reps` : ''}
          </b>{' '}
          — supera! 💪
        </div>
      )}

      <div className="mt-3 flex flex-col gap-2">
        {sets.map((st, i) => (
          <div key={i} className="flex items-center gap-2">
            <button
              onClick={() => {
                if (!st.done) {
                  playSound('ding')
                  haptic(15)
                }
                toggleSet(w, exIdx, i)
              }}
              className={cn(
                'grid h-9 w-9 shrink-0 place-items-center rounded-[10px] border text-sm font-extrabold transition-transform active:scale-90',
                st.done
                  ? 'border-done bg-done text-white'
                  : 'border-line bg-surface2 text-muted',
              )}
            >
              {st.done ? '✓' : i + 1}
            </button>
            {withLoad && (
              <>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step={0.5}
                  placeholder="kg"
                  value={st.kg ?? ''}
                  onChange={(e) =>
                    setSetValue(w, exIdx, i, 'kg', e.target.value === '' ? undefined : parseFloat(e.target.value))
                  }
                  className={numCls(st.done)}
                />
                <span className="shrink-0 text-[11px] font-bold text-muted">kg</span>
                <span className="shrink-0 font-extrabold text-muted">×</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={1}
                  placeholder="reps"
                  value={st.reps ?? ''}
                  onChange={(e) =>
                    setSetValue(w, exIdx, i, 'reps', e.target.value === '' ? undefined : parseFloat(e.target.value))
                  }
                  className={numCls(st.done)}
                />
                <span className="shrink-0 text-[11px] font-bold text-muted">reps</span>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        {DEMOS[ex.nome] && (
          <button
            onClick={() => openDemo({ nome: ex.nome, musculo: ex.musculo })}
            className="flex items-center gap-1.5 rounded-full border border-line bg-surface2 px-3 py-1.5 text-xs font-bold text-fg"
          >
            <Eye size={14} /> Demo
          </button>
        )}
        <a
          href={ytLink(ex.nome)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-full border border-line bg-surface2 px-3 py-1.5 text-xs font-bold text-fg"
        >
          <Play size={14} className="text-red-500" /> Vídeo
        </a>
      </div>
    </article>
  )
}
