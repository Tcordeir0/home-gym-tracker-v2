import { useEffect, useRef, useState } from 'react'
import { Download, Share2 } from 'lucide-react'
import { Modal } from './ui/Modal'
import { useStore, totalPoints } from '@/store'
import { statsFor, levelFor } from '@/lib/game'
import { THEMES } from '@/lib/themes'
import { useToast } from '@/lib/toast'

export function ShareModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const active = useStore((s) => s.profiles.find((p) => p.id === s.activeId)!)
  const activeId = useStore((s) => s.activeId)
  const scores = useStore((s) => s.scores)
  const history = useStore((s) => s.history[s.activeId]) ?? []
  const show = useToast((s) => s.show)
  const [url, setUrl] = useState<string | null>(null)
  const blobRef = useRef<Blob | null>(null)

  useEffect(() => {
    if (!open) return
    let cancelled = false
    void buildCard().then((r) => {
      if (!cancelled) {
        blobRef.current = r.blob
        setUrl(r.url)
      }
    })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, activeId])

  async function buildCard(): Promise<{ blob: Blob; url: string }> {
    const W = 1080
    const H = 1350
    const canvas = document.createElement('canvas')
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext('2d')!
    const v = (THEMES[active.theme] ?? THEMES.default).vars
    try {
      await document.fonts.ready
    } catch {
      /* fontes */
    }

    const pts = totalPoints(scores, activeId)
    const stats = statsFor(history, pts, active.freezes ?? 0)
    const lvl = levelFor(pts)

    ctx.fillStyle = v.bg
    ctx.fillRect(0, 0, W, H)
    ctx.fillStyle = v.surface
    ctx.beginPath()
    ctx.roundRect(60, 60, W - 120, H - 120, 48)
    ctx.fill()

    ctx.textAlign = 'center'
    ctx.fillStyle = v.muted
    ctx.font = '700 34px Manrope, sans-serif'
    ctx.fillText('HOME GYM · MEU TREINO', W / 2, 180)

    ctx.fillStyle = v.text
    ctx.font = '400 96px Anton, sans-serif'
    ctx.fillText(active.name.toUpperCase(), W / 2, 290)

    // nível + pontos
    ctx.fillStyle = v.accent
    ctx.font = '400 220px Anton, sans-serif'
    ctx.fillText(`NV.${lvl}`, W / 2, 560)
    ctx.fillStyle = v.text
    ctx.font = '800 60px Manrope, sans-serif'
    ctx.fillText(`${pts} pontos`, W / 2, 650)

    // grid de stats
    const cards: Array<[string, string]> = [
      [`${stats.treinos}`, 'TREINOS'],
      [`${stats.cardios}`, 'CARDIOS'],
      [`${stats.streak}`, 'SEQUÊNCIA'],
      [`${stats.activeDays}`, 'DIAS ATIVOS'],
    ]
    const gx = 110
    const gw = (W - gx * 2 - 30) / 2
    const gh = 200
    cards.forEach(([num, lbl], i) => {
      const x = gx + (i % 2) * (gw + 30)
      const y = 740 + Math.floor(i / 2) * (gh + 30)
      ctx.fillStyle = v.surface2
      ctx.beginPath()
      ctx.roundRect(x, y, gw, gh, 28)
      ctx.fill()
      ctx.fillStyle = v.accent
      ctx.font = '400 100px Anton, sans-serif'
      ctx.fillText(num, x + gw / 2, y + 110)
      ctx.fillStyle = v.muted
      ctx.font = '700 30px Manrope, sans-serif'
      ctx.fillText(lbl, x + gw / 2, y + 160)
    })

    ctx.fillStyle = v.muted
    ctx.font = '600 28px Manrope, sans-serif'
    ctx.fillText('tcordeir0.github.io/home-gym-tracker-v2', W / 2, H - 110)

    const url = canvas.toDataURL('image/png')
    const blob = await new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), 'image/png'))
    return { blob, url }
  }

  async function share() {
    const blob = blobRef.current
    if (!blob) return
    const file = new File([blob], 'home-gym.png', { type: 'image/png' })
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: 'Meu treino' })
      } catch {
        /* cancelado */
      }
    } else {
      download()
    }
  }

  function download() {
    if (!url) return
    const a = document.createElement('a')
    a.href = url
    a.download = 'home-gym.png'
    a.click()
    show('Imagem baixada ⤓')
  }

  return (
    <Modal open={open} onClose={onClose} title="Compartilhar">
      {url ? (
        <img src={url} alt="Card de treino" className="w-full rounded-2xl border border-line" />
      ) : (
        <div className="rounded-2xl border border-line bg-surface2 p-10 text-center text-sm text-muted">Gerando…</div>
      )}
      <button
        onClick={() => void share()}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3.5 font-extrabold text-on-accent active:scale-[0.99]"
      >
        <Share2 size={18} /> Compartilhar
      </button>
      <button
        onClick={download}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-surface2 py-3 font-bold text-fg"
      >
        <Download size={16} /> Baixar imagem
      </button>
    </Modal>
  )
}
