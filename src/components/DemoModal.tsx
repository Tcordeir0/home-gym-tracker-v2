import { useEffect, useState } from 'react'
import { Play } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { Modal } from './ui/Modal'
import { useDemo } from '@/lib/demo'
import { DEMOS, demoFrame, ytLink } from '@/data/demos'

export function DemoModal() {
  const ex = useDemo((s) => s.ex)
  const close = useDemo((s) => s.close)
  const [frame, setFrame] = useState(0)
  const folder = ex ? DEMOS[ex.nome] : null

  useEffect(() => {
    if (!ex || !folder) return
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reinicia a animação ao abrir
    setFrame(0)
    const iv = setInterval(() => setFrame((f) => (f + 1) % 2), 800)
    return () => clearInterval(iv)
  }, [ex, folder])

  return (
    <Modal open={!!ex} onClose={close} title={ex?.nome ?? 'Demonstração'}>
      {folder ? (
        <>
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-line bg-white">
            <AnimatePresence mode="wait">
              <motion.img
                key={frame}
                src={demoFrame(folder, frame)}
                alt=""
                className="absolute inset-0 h-full w-full object-contain"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              />
            </AnimatePresence>
          </div>
          {ex && <p className="mt-3 text-center text-xs uppercase tracking-wide text-muted">{ex.musculo}</p>}
        </>
      ) : (
        <div className="rounded-2xl border border-line bg-surface2 p-8 text-center text-sm text-muted">
          Sem demonstração offline pra este exercício — confere no vídeo 👇
        </div>
      )}

      {ex && (
        <a
          href={ytLink(ex.nome)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3.5 font-extrabold text-on-accent active:scale-[0.99]"
        >
          <Play size={18} /> Ver no YouTube
        </a>
      )}
      <p className="mt-2 text-center text-[11px] text-muted">
        Animação de 2 quadros (início e fim do movimento). Funciona offline.
      </p>
    </Modal>
  )
}
