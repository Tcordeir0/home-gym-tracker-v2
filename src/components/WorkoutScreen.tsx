import { useState } from 'react'
import { motion } from 'motion/react'
import { Check } from 'lucide-react'
import { useStore } from '@/store'
import { useToast } from '@/lib/toast'
import { playSound } from '@/lib/feedback'
import { cn } from '@/lib/utils'
import { ExerciseCard } from './ExerciseCard'
import type { WorkoutKey } from '@/types'

const TABS: WorkoutKey[] = ['A', 'B', 'C', 'warm']

export function WorkoutScreen() {
  const profile = useStore((s) => s.profiles.find((p) => p.id === s.activeId)!)
  const session = useStore((s) => s.sessions[s.activeId])
  const conclude = useStore((s) => s.concludeWorkout)
  const show = useToast((s) => s.show)
  const [tab, setTab] = useState<WorkoutKey>('A')

  const plan = profile.plan
  const exercises = plan.treinos[tab]
  const withLoad = tab !== 'warm'

  let done = 0
  let total = 0
  exercises.forEach((ex, i) => {
    total += ex.series
    done += (session?.[tab]?.[i] ?? []).filter((c) => c.done).length
  })
  const pct = total ? Math.round((done / total) * 100) : 0

  function onConclude() {
    const r = conclude(tab as 'A' | 'B' | 'C')
    if (r === 'ok') playSound('win')
    show(r === 'dup' ? `Treino ${tab} já concluído hoje ✅` : `Treino ${tab} concluído · +50 pts! 🔥`)
  }

  return (
    <div>
      <div className="sticky top-0 z-10 -mx-5 mb-3 flex gap-2 overflow-x-auto bg-bg/90 px-5 py-2 backdrop-blur">
        {TABS.map((k) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={cn(
              'shrink-0 rounded-xl border px-4 py-2 text-center font-extrabold leading-tight transition-colors',
              tab === k
                ? 'border-accent bg-accent text-on-accent'
                : 'border-line bg-surface text-muted',
            )}
          >
            <div className="text-sm">{k === 'warm' ? '🔥' : k}</div>
            <div className="text-[9px] font-semibold opacity-80">
              {k === 'warm' ? 'Aquecer' : plan.labels[k]}
            </div>
          </button>
        ))}
      </div>

      {withLoad && (
        <div className="mb-3">
          <div className="h-2 overflow-hidden rounded-full bg-surface2">
            <motion.div
              className="h-full rounded-full bg-accent"
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="mt-1 text-right text-xs text-muted">{pct}%</div>
        </div>
      )}

      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex flex-col gap-3"
      >
        {exercises.map((ex, i) => (
          <ExerciseCard
            key={`${tab}-${i}-${ex.nome}`}
            ex={ex}
            w={tab}
            exIdx={i}
            withLoad={withLoad}
          />
        ))}
      </motion.div>

      {withLoad && (
        <button
          onClick={onConclude}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3.5 font-extrabold text-on-accent transition-transform active:scale-[0.99]"
        >
          <Check size={18} /> Concluir Treino {tab} de hoje
        </button>
      )}
      <p className="mt-2 text-center text-xs text-muted">
        Registra a data no histórico e zera as marcações pro próximo treino.
      </p>
    </div>
  )
}
