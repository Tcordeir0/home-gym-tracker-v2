import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { HistoryEntry, Measure, Profile, Score, Session, WorkoutKey } from '@/types'
import { defaultProfiles } from '@/data/plans'

export const PTS_SET = 5
export const PTS_TREINO = 50

export function todayISO(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

type State = {
  profiles: Profile[]
  activeId: string
  history: Record<string, HistoryEntry[]>
  scores: Record<string, Score>
  sessions: Record<string, Record<string, Session>>
  measures: Record<string, Measure[]>
}

type Actions = {
  setActive: (id: string) => void
  setTheme: (theme: string) => void
  toggleSet: (w: WorkoutKey, exIdx: number, setIdx: number) => void
  setSetValue: (w: WorkoutKey, exIdx: number, setIdx: number, field: 'kg' | 'reps', value: number | undefined) => void
  concludeWorkout: (w: 'A' | 'B' | 'C') => 'ok' | 'dup'
  deleteEntry: (profileId: string, index: number) => void
  addMeasure: (m: Measure) => void
  deleteMeasure: (profileId: string, index: number) => void
}

export type Store = State & Actions

function emptySession(p: Profile, w: WorkoutKey): Session {
  return p.plan.treinos[w].map((ex) => Array.from({ length: ex.series }, () => ({ done: false })))
}

function ensureSession(s: State, profileId: string, w: WorkoutKey): Session {
  const p = s.profiles.find((x) => x.id === profileId)!
  s.sessions[profileId] ??= {}
  const cur = s.sessions[profileId][w]
  if (!cur || cur.length !== p.plan.treinos[w].length) {
    s.sessions[profileId][w] = emptySession(p, w)
  }
  return s.sessions[profileId][w]
}

function addPointsOn(s: State, profileId: string, date: string, n: number) {
  s.scores[profileId] ??= { byDay: {} }
  s.scores[profileId].byDay[date] = Math.max(0, (s.scores[profileId].byDay[date] ?? 0) + n)
}

export const useStore = create<Store>()(
  persist(
    immer((set) => ({
      profiles: defaultProfiles(),
      activeId: 'u1',
      history: {},
      scores: {},
      sessions: {},
      measures: {},

      setActive: (id) => set((s) => { s.activeId = id }),

      setTheme: (theme) =>
        set((s) => {
          const p = s.profiles.find((x) => x.id === s.activeId)
          if (p) p.theme = theme
        }),

      toggleSet: (w, exIdx, setIdx) =>
        set((s) => {
          const id = s.activeId
          const session = ensureSession(s, id, w)
          const cell = session[exIdx]?.[setIdx]
          if (!cell) return
          cell.done = !cell.done
          addPointsOn(s, id, todayISO(), cell.done ? PTS_SET : -PTS_SET)
        }),

      setSetValue: (w, exIdx, setIdx, field, value) =>
        set((s) => {
          const session = ensureSession(s, s.activeId, w)
          const cell = session[exIdx]?.[setIdx]
          if (!cell) return
          if (value == null || Number.isNaN(value)) delete cell[field]
          else cell[field] = value
        }),

      concludeWorkout: (w) => {
        let result: 'ok' | 'dup' = 'ok'
        set((s) => {
          const id = s.activeId
          const today = todayISO()
          s.history[id] ??= []
          if (s.history[id].some((e) => e.date === today && e.w === w)) {
            result = 'dup'
            return
          }
          const p = s.profiles.find((x) => x.id === id)!
          const session = ensureSession(s, id, w)
          const exercises = p.plan.treinos[w]
            .map((exercise, i) => ({
              nome: exercise.nome,
              musculo: exercise.musculo,
              sets: (session[i] ?? [])
                .filter((set) => set.done && (set.kg != null || set.reps != null))
                .map((set) => ({ kg: set.kg, reps: set.reps })),
            }))
            .filter((e) => e.sets.length > 0)

          s.history[id].push({
            date: today,
            w,
            pts: PTS_TREINO,
            ...(exercises.length ? { exercises } : {}),
          })
          addPointsOn(s, id, today, PTS_TREINO)
          // limpa a sessão concluída
          if (s.sessions[id]) delete s.sessions[id][w]
        })
        return result
      },

      deleteEntry: (profileId, index) =>
        set((s) => {
          const list = s.history[profileId]
          if (!list || !list[index]) return
          const removed = list[index]
          list.splice(index, 1)
          addPointsOn(s, profileId, removed.date, -(removed.pts ?? 0))
        }),

      addMeasure: (m) =>
        set((s) => {
          s.measures[s.activeId] ??= []
          s.measures[s.activeId].push(m)
        }),

      deleteMeasure: (profileId, index) =>
        set((s) => {
          s.measures[profileId]?.splice(index, 1)
        }),
    })),
    { name: 'home-gym-v2' },
  ),
)

export function totalPoints(scores: Record<string, Score>, id: string): number {
  const s = scores[id]
  if (!s) return 0
  return Object.values(s.byDay).reduce((a, b) => a + b, 0)
}
