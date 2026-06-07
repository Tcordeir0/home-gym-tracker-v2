import {
  Sparkles, Flame, Dumbbell, HeartPulse, CalendarCheck, Zap, Star, Award, Ruler,
  type LucideIcon,
} from 'lucide-react'
import type { HistoryEntry } from '@/types'

/* ---------- Níveis / XP ---------- */
export function xpForLevel(L: number) {
  return 100 * (L - 1) + 25 * (L - 1) * (L - 2)
}
export function levelFor(pts: number) {
  let L = 1
  while (xpForLevel(L + 1) <= pts) L++
  return L
}
export function levelInfo(pts: number) {
  const level = levelFor(pts)
  const cur = xpForLevel(level)
  const next = xpForLevel(level + 1)
  return {
    level,
    into: pts - cur,
    span: next - cur,
    pct: Math.max(0, Math.min(100, Math.round(((pts - cur) / (next - cur)) * 100))),
  }
}

/* ---------- Estatísticas (com tolerância de congeladores na sequência) ---------- */
const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export type Stats = {
  treinos: number
  cardios: number
  activeDays: number
  streak: number
  pts: number
}

export function statsFor(history: HistoryEntry[], pts: number, freezes: number): Stats {
  const treinos = history.filter((e) => e.w === 'A' || e.w === 'B' || e.w === 'C').length
  const cardios = history.filter((e) => e.w === 'cardio').length
  const days = new Set(history.map((e) => e.date))
  let streak = 0
  let fb = freezes
  const cur = new Date()
  for (let i = 0; i < 400; i++) {
    const ds = iso(cur)
    if (days.has(ds)) {
      streak++
      cur.setDate(cur.getDate() - 1)
    } else if (i === 0) {
      cur.setDate(cur.getDate() - 1)
    } else if (fb > 0) {
      fb--
      cur.setDate(cur.getDate() - 1)
    } else break
  }
  return { treinos, cardios, activeDays: days.size, streak, pts }
}

/* ---------- Conquistas ---------- */
export type Achievement = {
  id: string
  icon: LucideIcon
  label: string
  desc: string
  test: (s: Stats) => boolean
  milestone?: boolean
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'start', icon: Sparkles, label: 'Começou!', desc: '1º treino', test: (s) => s.treinos >= 1 },
  { id: 'rhythm', icon: Flame, label: 'Pegando o ritmo', desc: '5 treinos', test: (s) => s.treinos >= 5 },
  { id: 'dedicated', icon: Dumbbell, label: 'Dedicado', desc: '15 treinos', test: (s) => s.treinos >= 15 },
  { id: 'cardio', icon: HeartPulse, label: 'Cardio na veia', desc: '5 cardios', test: (s) => s.cardios >= 5 },
  { id: 'constant', icon: CalendarCheck, label: 'Constante', desc: '7 dias ativos', test: (s) => s.activeDays >= 7, milestone: true },
  { id: 'streak3', icon: Zap, label: 'Sequência 3', desc: '3 dias seguidos', test: (s) => s.streak >= 3 },
  { id: 'streak7', icon: Flame, label: 'Em chamas', desc: '7 dias seguidos', test: (s) => s.streak >= 7, milestone: true },
  { id: 'pts500', icon: Star, label: '500 pontos', desc: '500 pts', test: (s) => s.pts >= 500 },
  { id: 'pts1000', icon: Award, label: '1000 pontos', desc: '1000 pts', test: (s) => s.pts >= 1000, milestone: true },
]

/* ---------- Quests semanais ---------- */
export function weekStartISO() {
  const d = new Date()
  const day = (d.getDay() + 6) % 7 // 0 = segunda
  d.setDate(d.getDate() - day)
  return iso(d)
}

export type Quest = {
  id: string
  label: string
  goal: number
  reward: number
  icon: LucideIcon
  kind: 'treino' | 'cardio' | 'measure'
  freeze?: boolean
}

export const QUESTS: Quest[] = [
  { id: 't3', label: 'Faça 3 treinos', goal: 3, reward: 40, icon: Dumbbell, kind: 'treino' },
  { id: 'c2', label: 'Faça 2 cardios', goal: 2, reward: 30, icon: HeartPulse, kind: 'cardio' },
  { id: 'm1', label: 'Registre 1 medida', goal: 1, reward: 20, icon: Ruler, kind: 'measure', freeze: true },
]
