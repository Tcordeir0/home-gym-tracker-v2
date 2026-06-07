import { CalendarDays, Palette, Star } from 'lucide-react'
import { useStore, totalPoints } from '@/store'
import { THEMES } from '@/lib/themes'
import { cn } from '@/lib/utils'

export function Header({ onOpenHistory }: { onOpenHistory: () => void }) {
  const profiles = useStore((s) => s.profiles)
  const activeId = useStore((s) => s.activeId)
  const scores = useStore((s) => s.scores)
  const setActive = useStore((s) => s.setActive)
  const setTheme = useStore((s) => s.setTheme)
  const active = profiles.find((p) => p.id === activeId)!

  function cycleTheme() {
    const ids = Object.keys(THEMES)
    const next = ids[(ids.indexOf(active.theme) + 1) % ids.length]
    setTheme(next)
  }

  return (
    <header className="pt-[calc(env(safe-area-inset-top)+1rem)]">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl uppercase tracking-wide">
          Home <span className="text-accent">Gym</span>
        </h1>
        <div className="flex gap-2">
          <button
            onClick={cycleTheme}
            aria-label="Trocar tema"
            className="grid h-10 w-10 place-items-center rounded-full border border-line bg-surface text-fg"
          >
            <Palette size={18} />
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
        <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-4 py-1.5 font-display text-base text-accent">
          <Star size={15} /> {totalPoints(scores, activeId)} pts
        </span>
      </div>

      <p className="mt-3 text-sm text-muted">
        Ficha de <b className="text-fg">{active.name}</b> · foco em{' '}
        <b className="text-fg">{active.plan.focus}</b>
      </p>
    </header>
  )
}
