import { useEffect, useRef, useState } from 'react'
import { Image as ImageIcon, Trash2, Wrench } from 'lucide-react'
import { Modal } from './ui/Modal'
import { Avatar } from './ui/Avatar'
import { useStore } from '@/store'
import { resizePhoto } from '@/lib/image'
import { useToast } from '@/lib/toast'
import { EQUIPMENT, COLORS } from '@/data/pool'
import { cn } from '@/lib/utils'

const h3Cls = 'mb-2 mt-5 text-xs font-bold uppercase tracking-wider text-muted'
const inputCls = 'mt-1 w-full rounded-xl border border-line bg-surface2 px-3.5 py-3 text-fg outline-none focus:border-accent'

export function ProfileEditorModal({
  open,
  onClose,
  onOpenGenerator,
}: {
  open: boolean
  onClose: () => void
  onOpenGenerator: () => void
}) {
  const active = useStore((s) => s.profiles.find((p) => p.id === s.activeId)!)
  const count = useStore((s) => s.profiles.length)
  const updateProfile = useStore((s) => s.updateProfile)
  const deleteProfile = useStore((s) => s.deleteProfile)
  const show = useToast((s) => s.show)
  const fileRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState('')

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sincroniza o nome ao abrir
      setName(active.name)
    }
  }, [open, active])

  const equip = active.equipment

  function toggleEquip(k: string) {
    updateProfile({ equipment: equip.includes(k) ? equip.filter((x) => x !== k) : [...equip, k] })
  }

  async function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) {
      try {
        updateProfile({ photo: await resizePhoto(f) })
      } catch {
        show('Imagem inválida ❌')
      }
    }
    e.target.value = ''
  }

  function commit() {
    updateProfile({ name: name.trim() || active.name })
    onClose()
  }

  return (
    <Modal open={open} onClose={commit} title="Editar perfil">
      <label className="block text-xs font-bold text-muted">Nome</label>
      <input value={name} maxLength={16} onChange={(e) => setName(e.target.value)} className={inputCls} />

      <h3 className={h3Cls}>Foto</h3>
      <div className="flex flex-wrap items-center gap-3">
        <Avatar profile={active} size={56} />
        <button onClick={() => fileRef.current?.click()} className="flex items-center gap-2 rounded-xl border border-line bg-surface2 px-3.5 py-2.5 text-sm font-bold text-fg">
          <ImageIcon size={16} /> Escolher foto
        </button>
        {active.photo && (
          <button onClick={() => updateProfile({ photo: null })} className="rounded-xl border border-line bg-surface2 px-3.5 py-2.5 text-sm font-bold text-muted">
            Remover
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPhoto} />
      </div>

      <h3 className={h3Cls}>Cor do perfil</h3>
      <div className="flex flex-wrap gap-2">
        {COLORS.map((c) => (
          <button
            key={c}
            onClick={() => updateProfile({ color: c })}
            aria-label={`cor ${c}`}
            className={cn('h-9 w-9 rounded-full border-2', active.color === c ? 'border-fg' : 'border-transparent')}
            style={{ background: c }}
          />
        ))}
      </div>

      <h3 className={h3Cls}>Equipamento disponível</h3>
      <div className="flex flex-wrap gap-2">
        {EQUIPMENT.map((eq) => (
          <button
            key={eq.key}
            onClick={() => toggleEquip(eq.key)}
            className={cn(
              'rounded-full border px-3.5 py-2 text-sm font-bold transition-colors',
              equip.includes(eq.key) ? 'border-accent bg-accent text-on-accent' : 'border-line bg-surface2 text-muted',
            )}
          >
            {eq.label}
          </button>
        ))}
      </div>

      <button
        onClick={() => {
          commit()
          onOpenGenerator()
        }}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-surface2 py-3 font-bold text-fg"
      >
        <Wrench size={16} /> Montar treino com este equipamento
      </button>

      {count > 1 && (
        <button
          onClick={() => {
            deleteProfile(active.id)
            onClose()
          }}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-surface2 py-3 font-bold text-red-400"
        >
          <Trash2 size={16} /> Excluir este perfil
        </button>
      )}
    </Modal>
  )
}
