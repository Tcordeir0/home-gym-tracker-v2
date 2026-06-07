import { useState } from 'react'
import { motion } from 'motion/react'
import { Dumbbell, Flame, Sparkles } from 'lucide-react'
import { THEMES, applyTheme } from '@/lib/themes'
import { cn } from '@/lib/utils'

export default function App() {
  const [theme, setTheme] = useState('default')

  function pick(id: string) {
    setTheme(id)
    applyTheme(id)
  }

  return (
    <div className="mx-auto min-h-full max-w-md px-5 py-8">
      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="font-display text-4xl uppercase tracking-wide">
          Home <span className="text-accent">Gym</span>{' '}
          <span className="align-middle text-base text-muted">v2</span>
        </h1>
        <p className="mt-1 text-sm text-muted">
          Fundação React + TS + Tailwind + Motion ✓
        </p>
      </motion.header>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-2xl border border-line bg-surface p-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="font-bold">Supino no chão com halteres</div>
            <div className="mt-0.5 text-[10px] uppercase tracking-wide text-muted">
              Peito
            </div>
          </div>
          <div className="font-display text-xl text-accent">4×10</div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-sm text-muted">
          <Flame size={15} className="text-accent" /> Última vez:{' '}
          <b className="text-accent">22kg × 12</b> — supera!
        </div>
        <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3 font-extrabold text-on-accent transition-transform active:scale-[0.98]">
          <Dumbbell size={18} /> Concluir treino
        </button>
      </motion.section>

      <section className="mt-6">
        <h2 className="mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted">
          <Sparkles size={14} /> Temas (runtime)
        </h2>
        <div className="flex flex-wrap gap-2">
          {Object.values(THEMES).map((t) => (
            <button
              key={t.id}
              onClick={() => pick(t.id)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-sm font-bold transition-colors',
                theme === t.id
                  ? 'border-accent text-accent'
                  : 'border-line text-muted',
              )}
            >
              {t.name}
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
