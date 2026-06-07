import { useState } from 'react'
import { Wrench } from 'lucide-react'
import { Modal } from './ui/Modal'
import { useStore } from '@/store'
import { useToast } from '@/lib/toast'
import { FOCUS_OPTIONS, generatePlan, type Focus } from '@/data/pool'
import { cn } from '@/lib/utils'

const h3Cls = 'mb-2 mt-5 text-xs font-bold uppercase tracking-wider text-muted'

export function GeneratorModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const active = useStore((s) => s.profiles.find((p) => p.id === s.activeId)!)
  const setPlan = useStore((s) => s.setPlan)
  const show = useToast((s) => s.show)
  const [focus, setFocus] = useState<Focus>('Geral')
  const [per, setPer] = useState(5)

  function gen() {
    setPlan(generatePlan(active.equipment, focus, per))
    show('Treino montado! 💪')
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Montar treino">
      <p className="text-sm leading-relaxed text-muted">
        Gera 3 treinos (A/B/C) com base no equipamento de <b className="text-fg">{active.name}</b> e no foco.
      </p>

      <h3 className={h3Cls}>Foco</h3>
      <div className="flex flex-wrap gap-2">
        {FOCUS_OPTIONS.map((f) => (
          <button
            key={f}
            onClick={() => setFocus(f)}
            className={cn(
              'rounded-full border px-3.5 py-2 text-sm font-bold transition-colors',
              focus === f ? 'border-accent bg-accent text-on-accent' : 'border-line bg-surface2 text-muted',
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <h3 className={h3Cls}>Exercícios por treino</h3>
      <div className="flex gap-2">
        {[5, 6, 7].map((n) => (
          <button
            key={n}
            onClick={() => setPer(n)}
            className={cn(
              'flex-1 rounded-xl border py-3 font-extrabold transition-colors',
              per === n ? 'border-accent bg-accent text-on-accent' : 'border-line bg-surface2 text-muted',
            )}
          >
            {n}
          </button>
        ))}
      </div>

      <button
        onClick={gen}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3.5 font-extrabold text-on-accent active:scale-[0.99]"
      >
        <Wrench size={16} /> Gerar treino A / B / C
      </button>
      <p className="mt-2 text-xs leading-relaxed text-muted">
        Substitui a ficha atual deste perfil — pode regenerar quando quiser.
      </p>
    </Modal>
  )
}
