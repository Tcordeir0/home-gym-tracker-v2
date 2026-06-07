import { useState } from 'react'
import { Modal } from './ui/Modal'
import { useStore, todayISO } from '@/store'
import { useToast } from '@/lib/toast'
import { DEFAULT_CARDIOS, WORKOUTS } from '@/types'

const labelCls = 'mb-1 mt-3 block text-xs font-bold text-muted first:mt-0'
const fieldCls = 'w-full rounded-xl border border-line bg-surface2 px-3.5 py-3 text-fg outline-none focus:border-accent'

export function ManualRegisterModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const active = useStore((s) => s.profiles.find((p) => p.id === s.activeId)!)
  const registerManual = useStore((s) => s.registerManual)
  const show = useToast((s) => s.show)
  const cardios = active.cardios ?? DEFAULT_CARDIOS
  const [sel, setSel] = useState('treino:A')
  const [date, setDate] = useState(todayISO())

  function save() {
    if (date > todayISO()) {
      show('Não dá pra registrar no futuro')
      return
    }
    const [kind, v] = sel.split(':')
    let r: 'ok' | 'dup'
    if (kind === 'treino') {
      r = registerManual({ type: 'treino', key: v as 'A' | 'B' | 'C' }, date)
    } else {
      const c = cardios[parseInt(v, 10)]
      r = registerManual({ type: 'cardio', label: c.label, emoji: c.emoji }, date)
    }
    if (r === 'dup') show('Treino já registrado nesse dia ✅')
    else {
      show('Registrado! 📅')
      onClose()
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Registrar sessão">
      <label className={labelCls}>O que você fez?</label>
      <select value={sel} onChange={(e) => setSel(e.target.value)} className={fieldCls}>
        {WORKOUTS.map((k) => (
          <option key={k} value={`treino:${k}`}>
            Treino {k} · {active.plan.labels[k]}
          </option>
        ))}
        {cardios.map((c, i) => (
          <option key={c.label} value={`cardio:${i}`}>
            Cardio · {c.label}
          </option>
        ))}
      </select>

      <label className={labelCls}>Data</label>
      <input type="date" value={date} max={todayISO()} onChange={(e) => setDate(e.target.value)} className={fieldCls} />

      <button
        onClick={save}
        className="mt-4 w-full rounded-xl bg-accent py-3.5 font-extrabold text-on-accent active:scale-[0.99]"
      >
        Registrar
      </button>
      <p className="mt-2 text-xs leading-relaxed text-muted">
        Pra lançar um treino ou cardio que você fez antes. Treino conta uma vez por dia; cardio pode repetir.
      </p>
    </Modal>
  )
}
