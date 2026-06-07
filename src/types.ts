/** Modelo de dados do app (tipado). Espelha o v1, mas com tipos de verdade. */

export type WorkoutKey = 'A' | 'B' | 'C' | 'warm'
export const WORKOUTS: Array<'A' | 'B' | 'C'> = ['A', 'B', 'C']

export type Exercise = {
  nome: string
  musculo: string
  series: number
  reps: string
  dica: string
}

export type Plan = {
  focus: string
  labels: Record<'A' | 'B' | 'C', string>
  treinos: Record<WorkoutKey, Exercise[]>
}

export type Quests = { week: string; claimed: Record<string, boolean> }
export type Schedule = { days: number[]; time: string } // days: 0=Dom..6=Sáb
export type CardioType = { label: string; emoji: string }

export type Profile = {
  id: string
  name: string
  color: string
  photo?: string | null
  equipment: string[]
  plan: Plan
  theme: string // id do tema equipado ('default' = padrão)
  level: number
  freezes: number
  quests: Quests
  schedule?: Schedule
  cardios?: CardioType[]
}

export const DEFAULT_CARDIOS: CardioType[] = [
  { label: 'Corrida', emoji: '🏃' },
  { label: 'Natação', emoji: '🏊' },
]

/** Uma série lançada: feita? com quanta carga e reps. */
export type SetState = { done: boolean; kg?: number; reps?: number }

/** Sessão em andamento de um treino: por exercício, a lista de séries. */
export type Session = SetState[][]

export type LoggedExercise = {
  nome: string
  musculo: string
  sets: Array<{ kg?: number; reps?: number }>
}

export type HistoryEntry = {
  date: string // YYYY-MM-DD
  w: WorkoutKey | 'cardio'
  t?: string
  emoji?: string
  start?: string
  end?: string
  dur?: number
  pts: number
  exercises?: LoggedExercise[]
}

export type Score = { byDay: Record<string, number> }

export type Measure = {
  date: string // YYYY-MM-DD
  weight?: number
  arm?: number
  chest?: number
  waist?: number
  photo?: string // base64 (data URL)
}

export type MeasureField = 'weight' | 'arm' | 'chest' | 'waist'
