import type { Profile } from '@/types'
import { DECORATIONS } from '@/data/decorations'

export function Avatar({ profile, size }: { profile: Profile; size: number }) {
  const deco = profile.deco && DECORATIONS[profile.deco] ? DECORATIONS[profile.deco] : null
  const inner = deco ? Math.round(size * 0.8) : size

  const base = profile.photo ? (
    <img
      src={profile.photo}
      alt={profile.name}
      className="rounded-full object-cover"
      style={{ width: inner, height: inner }}
    />
  ) : (
    <span
      className="grid place-items-center rounded-full font-black text-black"
      style={{ width: inner, height: inner, background: profile.color, fontSize: inner * 0.42 }}
    >
      {profile.name[0]?.toUpperCase()}
    </span>
  )

  if (!deco) return <span className="shrink-0">{base}</span>

  return (
    <span className="relative inline-grid shrink-0 place-items-center" style={{ width: size, height: size }}>
      {base}
      <span
        className="pointer-events-none absolute inset-0 [&>svg]:h-full [&>svg]:w-full"
        dangerouslySetInnerHTML={{ __html: deco.svg }}
      />
    </span>
  )
}
