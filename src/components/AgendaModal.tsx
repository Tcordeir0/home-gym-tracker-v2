import { useEffect, useState } from 'react'
import { Bell, Check } from 'lucide-react'
import { Modal } from './ui/Modal'
import { useStore } from '@/store'
import { useToast } from '@/lib/toast'
import { enablePush, disablePush, getPushSub, savePushSub } from '@/lib/push'
import { cn } from '@/lib/utils'

const DOW = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const inputCls = 'mt-1 w-full rounded-xl border border-line bg-surface2 px-3.5 py-3 text-fg outline-none focus:border-accent'
const h3Cls = 'mb-2 mt-5 text-xs font-bold uppercase tracking-wider text-muted'

export function AgendaModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const active = useStore((s) => s.profiles.find((p) => p.id === s.activeId)!)
  const setSchedule = useStore((s) => s.setSchedule)
  const show = useToast((s) => s.show)
  const [days, setDays] = useState<number[]>([])
  const [time, setTime] = useState('18:00')
  const [pushOn, setPushOn] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!open) return
    /* eslint-disable react-hooks/set-state-in-effect -- sincroniza o formulário com o perfil ao abrir */
    setDays(active.schedule?.days ?? [])
    setTime(active.schedule?.time ?? '18:00')
    /* eslint-enable react-hooks/set-state-in-effect */
    void getPushSub().then((s) => setPushOn(!!s))
  }, [open, active])

  function toggleDay(i: number) {
    setDays((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i]))
  }

  async function persist() {
    const sorted = [...days].sort()
    setSchedule(sorted, time)
    if (pushOn) {
      const sub = await getPushSub()
      if (sub) await savePushSub(sub)
    }
  }

  async function togglePush() {
    setBusy(true)
    if (pushOn) {
      await disablePush()
      setPushOn(false)
      show('Notificações desativadas')
    } else {
      setSchedule([...days].sort(), time)
      const r = await enablePush()
      if (r === 'ok') {
        setPushOn(true)
        show('Notificações ativadas ✅')
      } else if (r === 'noauth') show('Entre na conta (nuvem) primeiro')
      else if (r === 'denied') show('Permissão negada')
      else show('Aparelho sem suporte a push')
    }
    setBusy(false)
  }

  async function saveAndClose() {
    await persist()
    onClose()
  }

  return (
    <Modal open={open} onClose={() => void saveAndClose()} title={`Agenda — ${active.name}`}>
      <h3 className={h3Cls}>Dias de treino</h3>
      <div className="flex gap-1.5">
        {DOW.map((d, i) => (
          <button
            key={i}
            onClick={() => toggleDay(i)}
            className={cn(
              'min-w-0 flex-1 rounded-lg border py-2.5 text-center text-[13px] font-extrabold transition-colors',
              days.includes(i) ? 'border-accent bg-accent text-on-accent' : 'border-line bg-surface2 text-muted',
            )}
          >
            {d}
          </button>
        ))}
      </div>

      <label className="mt-4 block text-xs font-bold text-muted">Horário do lembrete</label>
      <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inputCls} />

      <h3 className={h3Cls}>Notificações no celular</h3>
      <button
        disabled={busy}
        onClick={togglePush}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-surface2 py-3 font-bold text-fg disabled:opacity-60"
      >
        {pushOn ? <Check size={16} /> : <Bell size={16} />}{' '}
        {pushOn ? 'Notificações ativadas · tocar pra desativar' : 'Ativar notificações neste aparelho'}
      </button>
      <p className="mt-2 text-xs leading-relaxed text-muted">
        Recebe o lembrete <b className="text-fg">mesmo com o app fechado</b>. No iPhone: instale o app na tela
        inicial (Compartilhar → Adicionar à Tela de Início) e abra por lá. Precisa estar logado na nuvem.
      </p>

      <button
        onClick={() => void saveAndClose()}
        className="mt-4 w-full rounded-xl bg-accent py-3.5 font-extrabold text-on-accent active:scale-[0.99]"
      >
        Salvar agenda
      </button>
    </Modal>
  )
}
