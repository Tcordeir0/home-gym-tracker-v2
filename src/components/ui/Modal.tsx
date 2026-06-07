import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'

/** Trava o scroll do body enquanto algum modal está aberto (técnica iOS-safe:
 *  position:fixed + restaura o scrollY). Reference-counted p/ modais empilhados. */
let lockCount = 0
let savedY = 0
function lockScroll() {
  if (lockCount++ === 0) {
    savedY = window.scrollY
    document.body.style.position = 'fixed'
    document.body.style.top = `-${savedY}px`
    document.body.style.width = '100%'
  }
}
function unlockScroll() {
  if (--lockCount <= 0) {
    lockCount = 0
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.width = ''
    window.scrollTo(0, savedY)
  }
}

type ModalProps = {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!open) return
    lockScroll()
    return () => unlockScroll()
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose()
          }}
        >
          <motion.div
            className="themed-surface max-h-[90dvh] w-full max-w-xl overflow-x-hidden overflow-y-auto rounded-t-3xl border border-line bg-bg p-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] [overscroll-behavior:contain]"
            initial={{ y: 48 }}
            animate={{ y: 0 }}
            exit={{ y: 48 }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="truncate font-display text-2xl uppercase tracking-wide">
                {title}
              </h2>
              <button
                onClick={onClose}
                aria-label="Fechar"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line bg-surface text-fg"
              >
                <X size={18} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
