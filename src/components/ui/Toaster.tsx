import { AnimatePresence, motion } from 'motion/react'
import { useToast } from '@/lib/toast'

export function Toaster() {
  const msg = useToast((s) => s.msg)
  return (
    <AnimatePresence>
      {msg && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 rounded-full border border-line bg-surface2 px-5 py-3 text-sm font-bold text-fg shadow-lg"
        >
          {msg}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
