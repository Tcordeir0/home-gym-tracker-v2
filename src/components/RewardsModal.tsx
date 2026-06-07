import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Check, CalendarClock, Dices, Settings, Share2 } from 'lucide-react'
import { Modal } from './ui/Modal'
import { useStore, totalPoints } from '@/store'
import { levelInfo, statsFor, earnedAchCount, ACHIEVEMENTS, QUESTS, weekStartISO } from '@/lib/game'
import { THEMES, ALL_THEME_IDS } from '@/lib/themes'
import { DECORATIONS, ALL_DECORATIONS } from '@/data/decorations'
import { playSound } from '@/lib/feedback'
import { useToast } from '@/lib/toast'
import { cn } from '@/lib/utils'

function DecoIcon({ id, size = 44 }: { id: string; size?: number }) {
  return (
    <span
      className="inline-block [&>svg]:h-full [&>svg]:w-full"
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: DECORATIONS[id].svg }}
    />
  )
}

const h3Cls = 'mb-2 mt-5 text-xs font-bold uppercase tracking-wider text-muted'

function ThemeChip({ id, equipped, onPick }: { id: string; equipped: boolean; onPick: () => void }) {
  const th = THEMES[id]
  return (
    <button
      onClick={onPick}
      className={cn('flex items-center gap-2 rounded-xl border p-2.5 text-left', equipped ? 'border-accent' : 'border-line')}
      style={{ background: th.vars.surface }}
    >
      <span className="h-5 w-5 shrink-0 rounded-full" style={{ background: th.vars.accent }} />
      <span className="flex-1 truncate text-sm font-bold" style={{ color: th.vars.text }}>
        {th.name}
      </span>
      {equipped && <Check size={16} style={{ color: th.vars.accent }} />}
    </button>
  )
}

export function RewardsModal({
  open,
  onClose,
  onOpenAgenda,
  onOpenSettings,
  onOpenShare,
}: {
  open: boolean
  onClose: () => void
  onOpenAgenda: () => void
  onOpenSettings: () => void
  onOpenShare: () => void
}) {
  const active = useStore((s) => s.profiles.find((p) => p.id === s.activeId)!)
  const activeId = useStore((s) => s.activeId)
  const scores = useStore((s) => s.scores)
  const history = useStore((s) => s.history[s.activeId]) ?? []
  const measures = useStore((s) => s.measures[s.activeId]) ?? []
  const setTheme = useStore((s) => s.setTheme)
  const claimQuests = useStore((s) => s.claimQuests)
  const spinRoulette = useStore((s) => s.spinRoulette)
  const setDeco = useStore((s) => s.setDeco)
  const show = useToast((s) => s.show)
  const [reel, setReel] = useState<string | null>(null)
  const [spinning, setSpinning] = useState(false)
  const reelRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (open) claimQuests()
  }, [open, claimQuests])

  useEffect(() => () => { if (reelRef.current) clearInterval(reelRef.current) }, [])

  const pts = totalPoints(scores, activeId)
  const info = levelInfo(pts)
  const stats = statsFor(history, pts, active.freezes ?? 0)
  const freezes = active.freezes ?? 0
  const ownedDecos = active.decos ?? []
  const spins = Math.max(0, earnedAchCount(stats) - (active.spinsUsed ?? 0))

  function spin() {
    if (spinning) return
    const won = spinRoulette()
    if (!won) {
      show(spins <= 0 ? 'Sem giros — desbloqueie conquistas' : 'Você já tem todas as decorações! 🎉')
      return
    }
    setSpinning(true)
    let n = 0
    reelRef.current = setInterval(() => {
      setReel(ALL_DECORATIONS[Math.floor(Math.random() * ALL_DECORATIONS.length)])
      if (++n > 14) {
        if (reelRef.current) clearInterval(reelRef.current)
        setReel(won)
        setSpinning(false)
        playSound('win')
        show('Ganhou: ' + DECORATIONS[won].name + '! 🎉')
      }
    }, 90)
  }

  const wk = weekStartISO()
  const hist = history.filter((e) => e.date >= wk)
  const prog: Record<string, number> = {
    treino: hist.filter((e) => e.w === 'A' || e.w === 'B' || e.w === 'C').length,
    cardio: hist.filter((e) => e.w === 'cardio').length,
    measure: measures.filter((m) => m.date >= wk).length,
  }

  return (
    <Modal open={open} onClose={onClose} title={`Recompensas — ${active.name}`}>
      <div className="rounded-2xl border border-line bg-surface2 p-3.5">
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-2 font-extrabold">
            <span className="rounded-lg bg-accent px-2.5 py-0.5 font-display text-on-accent">Nv.{info.level}</span>
            {active.name}
          </span>
          <span className="shrink-0 text-[11px] text-muted">
            {info.into} / {info.span} XP
          </span>
        </div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full border border-line bg-surface">
          <motion.div className="h-full rounded-full bg-accent" animate={{ width: `${info.pct}%` }} transition={{ duration: 0.6 }} />
        </div>
        <div className="mt-2 text-xs text-muted">
          🧊 <b className="text-fg">{freezes}</b> congelador{freezes === 1 ? '' : 'es'} — segura {freezes}{' '}
          falta{freezes === 1 ? '' : 's'} na sequência
        </div>
      </div>

      <h3 className={h3Cls}>Desafios da semana</h3>
      <div className="flex flex-col gap-2">
        {QUESTS.map((q) => {
          const p = Math.min(prog[q.kind], q.goal)
          const done = p >= q.goal
          const Icon = q.icon
          return (
            <div key={q.id} className={cn('flex items-center gap-3 rounded-xl border bg-surface p-2.5', done ? 'border-done' : 'border-line')}>
              <div className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-lg', done ? 'bg-done text-white' : 'bg-surface2 text-accent')}>
                {done ? <Check size={18} /> : <Icon size={18} />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold">{q.label}</div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface2">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${(p / q.goal) * 100}%` }} />
                </div>
              </div>
              <div className={cn('shrink-0 text-[11px] font-extrabold', done ? 'text-done' : 'text-muted')}>
                {done ? '✓' : `${p}/${q.goal}`} · +{q.reward}
                {q.freeze ? ' 🧊' : ''}
              </div>
            </div>
          )
        })}
      </div>

      <h3 className={h3Cls}>Conquistas</h3>
      <div className="grid grid-cols-2 gap-2">
        {ACHIEVEMENTS.map((a) => {
          const on = a.test(stats)
          const Icon = a.icon
          return (
            <div key={a.id} className={cn('flex items-center gap-2 rounded-xl border border-line bg-surface p-2.5', !on && 'opacity-40')}>
              <span className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-lg', on ? 'bg-accent/15 text-accent' : 'bg-surface2 text-muted')}>
                <Icon size={20} />
              </span>
              <div className="min-w-0">
                <div className="truncate text-sm font-bold">{a.label}</div>
                <div className="truncate text-[11px] text-muted">{a.desc}</div>
              </div>
            </div>
          )
        })}
      </div>

      <h3 className={h3Cls}>Temas</h3>
      <div className="grid grid-cols-2 gap-2">
        <ThemeChip id="default" equipped={active.theme === 'default'} onPick={() => setTheme('default')} />
        {ALL_THEME_IDS.map((id) => (
          <ThemeChip key={id} id={id} equipped={active.theme === id} onPick={() => setTheme(id)} />
        ))}
      </div>

      <h3 className={h3Cls}>Roleta de decorações</h3>
      <div className="rounded-2xl border border-line bg-surface2 p-4 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center">
          {reel ? <DecoIcon id={reel} size={72} /> : <Dices size={40} className="text-muted" />}
        </div>
        <button
          onClick={spin}
          disabled={spinning}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3 font-extrabold text-on-accent disabled:opacity-60"
        >
          <Dices size={16} /> Girar ({spins})
        </button>
        <p className="mt-2 text-[11px] text-muted">Cada conquista desbloqueada dá um giro.</p>
      </div>

      <h3 className={h3Cls}>Decorações do avatar</h3>
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => setDeco(null)}
          className={cn(
            'flex flex-col items-center gap-1 rounded-xl border p-2 text-[11px] font-bold',
            !active.deco ? 'border-accent text-accent' : 'border-line text-muted',
          )}
        >
          <span className="grid h-11 w-11 place-items-center">—</span> Nenhuma
        </button>
        {ownedDecos.map((id) => (
          <button
            key={id}
            onClick={() => setDeco(id)}
            className={cn(
              'flex flex-col items-center gap-1 rounded-xl border p-2 text-[11px] font-bold',
              active.deco === id ? 'border-accent text-accent' : 'border-line text-fg',
            )}
          >
            <DecoIcon id={id} size={44} /> {DECORATIONS[id].name}
          </button>
        ))}
        {ownedDecos.length === 0 && (
          <span className="col-span-3 rounded-xl border border-line bg-surface p-3 text-center text-xs text-muted">
            Gire a roleta pra ganhar decorações ✨
          </span>
        )}
      </div>

      <button
        onClick={onOpenShare}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-extrabold text-on-accent"
      >
        <Share2 size={16} /> Compartilhar conquista
      </button>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <button onClick={onOpenAgenda} className="flex items-center justify-center gap-2 rounded-xl border border-line bg-surface py-3 text-sm font-bold text-fg">
          <CalendarClock size={16} /> Agenda
        </button>
        <button onClick={onOpenSettings} className="flex items-center justify-center gap-2 rounded-xl border border-line bg-surface py-3 text-sm font-bold text-fg">
          <Settings size={16} /> Config.
        </button>
      </div>
    </Modal>
  )
}
