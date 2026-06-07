import { Modal } from './ui/Modal'
import { useStore } from '@/store'
import { cn } from '@/lib/utils'
import { useToast } from '@/lib/toast'

const OPTIONS = [
  { k: 'both', label: 'Som + vibração' },
  { k: 'sound', label: 'Só som' },
  { k: 'vibrate', label: 'Só vibração' },
  { k: 'none', label: 'Nenhum' },
] as const

const h3Cls = 'mb-2 mt-5 text-xs font-bold uppercase tracking-wider text-muted first:mt-0'

export function SettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const feedback = useStore((s) => s.feedback)
  const setFeedback = useStore((s) => s.setFeedback)
  const resetPoints = useStore((s) => s.resetPoints)
  const active = useStore((s) => s.profiles.find((p) => p.id === s.activeId)!)
  const show = useToast((s) => s.show)

  return (
    <Modal open={open} onClose={onClose} title="Configurações">
      <h3 className={h3Cls}>Feedback ao tocar</h3>
      <div className="grid grid-cols-2 gap-2">
        {OPTIONS.map((o) => (
          <button
            key={o.k}
            onClick={() => setFeedback(o.k)}
            className={cn(
              'rounded-xl border py-3 text-sm font-bold transition-colors',
              feedback === o.k ? 'border-accent bg-accent text-on-accent' : 'border-line bg-surface2 text-muted',
            )}
          >
            {o.label}
          </button>
        ))}
      </div>

      <h3 className={h3Cls}>Pontos</h3>
      <button
        onClick={() => {
          resetPoints()
          show('Pontos zerados')
        }}
        className="w-full rounded-xl border border-line bg-surface2 py-3 font-bold text-red-400"
      >
        Zerar pontos de {active.name}
      </button>
      <p className="mt-2 text-xs text-muted">O histórico não é apagado.</p>
    </Modal>
  )
}
