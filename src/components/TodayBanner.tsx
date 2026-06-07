import { CalendarCheck, Check } from 'lucide-react'
import { useStore, todayISO } from '@/store'
import { cn } from '@/lib/utils'

export function TodayBanner() {
  const active = useStore((s) => s.profiles.find((p) => p.id === s.activeId)!)
  const history = useStore((s) => s.history[s.activeId]) ?? []
  const sched = active.schedule

  if (!sched?.days?.length || !sched.days.includes(new Date().getDay())) return null

  const today = todayISO()
  const did = history.some((e) => e.date === today && (e.w === 'A' || e.w === 'B' || e.w === 'C'))

  return (
    <div
      className={cn(
        'mt-3 flex items-center gap-2 rounded-xl border px-3.5 py-3 text-sm font-bold',
        did
          ? 'border-done/45 bg-done/10 text-fg'
          : 'border-accent/45 bg-accent/10 text-fg',
      )}
    >
      {did ? <Check size={16} className="text-done" /> : <CalendarCheck size={16} className="text-accent" />}
      {did ? (
        <span>
          <b className="text-done">Treino de hoje feito!</b> Mandou bem 🔥
        </span>
      ) : (
        <span>
          <b className="text-accent">Hoje é dia de treino!</b> Bora? 💪
        </span>
      )}
    </div>
  )
}
