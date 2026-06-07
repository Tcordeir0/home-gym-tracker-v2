import { useStore } from '@/store'

let audioCtx: AudioContext | null = null

export function playSound(kind: 'ding' | 'win') {
  const fb = useStore.getState().feedback
  if (fb === 'none' || fb === 'vibrate') return
  try {
    audioCtx ??= new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    const ctx = audioCtx
    const notes = kind === 'win' ? [523, 659, 784, 1047] : [880, 1319]
    const step = kind === 'win' ? 0.09 : 0.075
    const t0 = ctx.currentTime
    notes.forEach((f, i) => {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = 'sine'
      o.frequency.value = f
      const start = t0 + i * step
      const dur = 0.13
      g.gain.setValueAtTime(0.0001, start)
      g.gain.exponentialRampToValueAtTime(0.22, start + 0.01)
      g.gain.exponentialRampToValueAtTime(0.0001, start + dur)
      o.connect(g)
      g.connect(ctx.destination)
      o.start(start)
      o.stop(start + dur)
    })
  } catch {
    /* sem áudio */
  }
}

export function haptic(pattern: number | number[] = 15) {
  const fb = useStore.getState().feedback
  if ((fb === 'both' || fb === 'vibrate') && 'vibrate' in navigator) navigator.vibrate(pattern)
}
