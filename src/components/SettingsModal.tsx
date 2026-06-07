import { useRef } from 'react'
import { Download, Upload } from 'lucide-react'
import { Modal } from './ui/Modal'
import { useStore } from '@/store'
import { exportBackup, importBackup } from '@/lib/backup'
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
  const fileRef = useRef<HTMLInputElement>(null)

  async function onImport(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    e.target.value = ''
    if (!f) return
    if (!confirm('Importar substitui TODOS os dados deste aparelho. Continuar?')) return
    show((await importBackup(f)) ? 'Backup importado! ✅' : 'Arquivo inválido ❌')
  }

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

      <h3 className={h3Cls}>Backup dos dados</h3>
      <div className="grid grid-cols-2 gap-2">
        <button onClick={exportBackup} className="flex items-center justify-center gap-2 rounded-xl border border-line bg-surface2 py-3 text-sm font-bold text-fg">
          <Download size={16} /> Exportar
        </button>
        <button onClick={() => fileRef.current?.click()} className="flex items-center justify-center gap-2 rounded-xl border border-line bg-surface2 py-3 text-sm font-bold text-fg">
          <Upload size={16} /> Importar
        </button>
        <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={onImport} />
      </div>
      <p className="mt-2 text-xs text-muted">
        Exporta tudo num arquivo (guarde no iCloud/Arquivos). A sincronização na nuvem já mantém os aparelhos juntos.
      </p>

      <h3 className={h3Cls}>Tester</h3>
      <p className="text-xs leading-relaxed text-muted">
        Crie um perfil chamado <b className="text-fg">TCORDEIRO</b> pra liberar todas as decorações de avatar (pra testar).
      </p>
    </Modal>
  )
}
