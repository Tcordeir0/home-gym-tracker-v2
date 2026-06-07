import { CalendarDays, Cloud, Sparkles, Star } from 'lucide-react'
import { useStore, totalPoints } from '@/store'
import { useAuth } from '@/lib/sync'
import { levelFor } from '@/lib/game'
import { cn } from '@/lib/utils'

export function Header({
  onOpenHistory,
  onOpenRewards,
  onOpenCloud,
}: {
  onOpenHistory: () => void
  onOpenRewards: () => void
  onOpenCloud: () => void
}) {
  const profiles = useStore((s) => s.profiles)
  const activeId = useStore((s) => s.activeId)
  const scores = useStore((s) => s.scores)
  const setActive = useStore((s) => s.setActive)
  const synced = useAuth((s) => !!s.email)
  const active = profiles.find((p) => p.id === activeId)!
  const pts = totalPoints(scores, activeId)

  return (
    <header className="pt-[calc(env(safe-area-inset-top)+1rem)]">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl uppercase tracking-wide">
          Home <span className="text-accent">Gym</span>
        </h1>
        <div className="flex gap-2">
          <button
            onClick={onOpenCloud}
            aria-label="Sincronização"
            className={cn(
              'grid h-10 w-10 place-items-center rounded-full border bg-surface',
              synced ? 'border-accent text-accent' : 'border-line text-fg',
            )}
          >
            <Cloud size={18} />
          </button>
          <button
            onClick={onOpenRewards}
            aria-label="Recompensas"
            className="grid h-10 w-10 place-items-center rounded-full border border-line bg-surface text-fg"
          >
            <Sparkles size={18} />
          </button>
          <button
            onClick={onOpenHistory}
            aria-label="Histórico"
            className="grid h-10 w-10 place-items-center rounded-full border border-line bg-surface text-fg"
          >
            <CalendarDays size={18} />
          </button>
        </div>
      </div>

      <div className="-mx-5 mt-3 flex gap-2 overflow-x-auto px-5 pb-1">
        {profiles.map((p) => (
          <button
            key={p.id}
            onClick={() => setActive(p.id)}
            className={cn(
              'flex shrink-0 items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3.5 text-sm font-bold transition-colors',
              p.id === activeId ? 'border-accent text-fg' : 'border-line text-muted',
            )}
          >
            <span
              className="grid h-7 w-7 place-items-center rounded-full text-xs font-black text-black"
              style={{ background: p.color }}
            >
              {p.name[0]?.toUpperCase()}
            </span>
            {p.name}
          </button>
        ))}
      </div>

      <div className="mt-3 text-center">
        <button
          onClick={onOpenRewards}
          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-4 py-1.5 font-display text-base text-accent"
        >
          <Star size={15} /> Nv.{levelFor(pts)} · {pts} pts
        </button>
      </div>

      <p className="mt-3 text-sm text-muted">
        Ficha de <b className="text-fg">{active.name}</b> · foco em{' '}
        <b className="text-fg">{active.plan.focus}</b>
      </p>
    </header>
  )
}
