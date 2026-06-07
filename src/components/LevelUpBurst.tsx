import { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useStore } from '@/store'

const SPARKS = Array.from({ length: 16 }, (_, i) => {
  const ang = (Math.PI * 2 * i) / 16
  const dist = 90 + (i % 3) * 28
  return { dx: Math.cos(ang) * dist, dy: Math.sin(ang) * dist, delay: (i % 4) * 0.03 }
})

export function LevelUpBurst() {
  const lv = useStore((s) => s.pendingLevelUp)
  const clear = useStore((s) => s.clearLevelUp)

  useEffect(() => {
    if (lv == null) return
    const t = setTimeout(clear, 2200)
    return () => clearTimeout(t)
  }, [lv, clear])

  return (
    <AnimatePresence>
      {lv != null && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center overflow-hidden bg-black/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={clear}
        >
          <div className="relative">
            {SPARKS.map((s, i) => (
              <motion.span
                key={i}
                className="absolute left-1/2 top-1/2 h-2.5 w-2.5 rounded-[2px] bg-accent"
                initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                animate={{ x: s.dx, y: s.dy, scale: 0, opacity: 0 }}
                transition={{ duration: 0.9, delay: s.delay, ease: 'easeOut' }}
              />
            ))}
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 12, stiffness: 200 }}
              className="relative text-center"
            >
              <div
                className="font-display text-6xl text-accent"
                style={{ textShadow: '0 0 34px var(--accent)' }}
              >
                Nv. {lv}
              </div>
              <div className="mt-2 text-sm font-extrabold uppercase tracking-[3px] text-fg">
                Subiu de nível!
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
