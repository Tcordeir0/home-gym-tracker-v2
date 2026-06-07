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

export type Profile = {
  id: string
  name: string
  color: string
  photo?: string | null
  equipment: string[]
  plan: Plan
  theme: string // id do tema cosmético equipado ('default' = padrão)
}

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
