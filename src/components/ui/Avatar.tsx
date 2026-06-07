import type { Profile } from '@/types'

export function Avatar({ profile, size }: { profile: Profile; size: number }) {
  if (profile.photo) {
    return (
      <img
        src={profile.photo}
        alt={profile.name}
        className="shrink-0 rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    )
  }
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full font-black text-black"
      style={{ width: size, height: size, background: profile.color, fontSize: size * 0.42 }}
    >
      {profile.name[0]?.toUpperCase()}
    </span>
  )
}
