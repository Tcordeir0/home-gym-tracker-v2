import { useState } from 'react'
import { Cloud, LogOut } from 'lucide-react'
import { Modal } from './ui/Modal'
import { useAuth, signIn, signOut } from '@/lib/sync'
import { useToast } from '@/lib/toast'

const inputCls =
  'mt-2 w-full rounded-xl border border-line bg-surface2 px-3.5 py-3 text-fg outline-none focus:border-accent'

export function CloudModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const email = useAuth((s) => s.email)
  const show = useToast((s) => s.show)
  const [em, setEm] = useState('')
  const [pw, setPw] = useState('')
  const [busy, setBusy] = useState(false)

  async function doLogin() {
    if (!em.trim() || !pw) {
      show('Preencha e-mail e senha')
      return
    }
    setBusy(true)
    const { error } = await signIn(em.trim(), pw)
    setBusy(false)
    if (error) show('Login falhou ❌')
    else {
      show('Sincronizado ☁️✅')
      setPw('')
      onClose()
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Sincronização">
      {email ? (
        <>
          <p className="text-sm leading-relaxed text-muted">
            Conectado como <b className="text-fg">{email}</b>. Treinos, medidas e pontos
            sincronizam automaticamente entre os aparelhos. ☁️
          </p>
          <button
            onClick={() => {
              void signOut()
              show('Saiu da conta')
            }}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-surface2 py-3 font-bold text-fg"
          >
            <LogOut size={16} /> Sair desta conta
          </button>
        </>
      ) : (
        <>
          <p className="text-sm leading-relaxed text-muted">
            Entre na conta compartilhada pra sincronizar tudo entre os aparelhos (Talys,
            Andressa…).
          </p>
          <input
            className={inputCls}
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="E-mail"
            value={em}
            onChange={(e) => setEm(e.target.value)}
          />
          <input
            className={inputCls}
            type="password"
            autoComplete="current-password"
            placeholder="Senha"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          />
          <button
            disabled={busy}
            onClick={doLogin}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3.5 font-extrabold text-on-accent disabled:opacity-60"
          >
            <Cloud size={16} /> {busy ? 'Entrando…' : 'Entrar e sincronizar'}
          </button>
        </>
      )}
    </Modal>
  )
}
