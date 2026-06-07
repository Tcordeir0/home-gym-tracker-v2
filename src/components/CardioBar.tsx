import { useStore, PTS_CARDIO } from '@/store'
import { DEFAULT_CARDIOS } from '@/types'
import { useToast } from '@/lib/toast'

export function CardioBar() {
  const active = useStore((s) => s.profiles.find((p) => p.id === s.activeId)!)
  const addCardio = useStore((s) => s.addCardio)
  const show = useToast((s) => s.show)
  const cardios = active.cardios ?? DEFAULT_CARDIOS

  return (
    <div className="-mx-5 mt-3 flex gap-2 overflow-x-auto px-5">
      {cardios.map((c) => (
        <button
          key={c.label}
          onClick={() => {
            addCardio(c.label, c.emoji)
            show(`${c.emoji} ${c.label} · +${PTS_CARDIO} pts!`)
          }}
          className="flex shrink-0 items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-bold text-fg transition-transform active:scale-95"
        >
          <span>{c.emoji}</span> {c.label}
        </button>
      ))}
    </div>
  )
}
