import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { HistoryEntry, Measure, Plan, Profile, Score, Session, WorkoutKey } from '@/types'
import { defaultProfiles } from '@/data/plans'
import { COLORS, generatePlan } from '@/data/pool'
import { levelFor, statsFor, earnedAchCount, QUESTS, weekStartISO } from '@/lib/game'
import { ALL_DECORATIONS } from '@/data/decorations'

export const PTS_SET = 5
export const PTS_TREINO = 50
export const PTS_CARDIO = 30

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
  pendingLevelUp: number | null
  feedback: 'both' | 'sound' | 'vibrate' | 'none'
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
  clearLevelUp: () => void
  claimQuests: () => void
  setSchedule: (days: number[], time: string) => void
  addCardio: (label: string, emoji: string) => void
  updateProfile: (patch: Partial<Profile>) => void
  addProfile: () => void
  deleteProfile: (id: string) => void
  setPlan: (plan: Plan) => void
  setFeedback: (mode: State['feedback']) => void
  resetPoints: () => void
  spinRoulette: () => string | null
  setDeco: (id: string | null) => void
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

function pointsOf(s: State, id: string) {
  const sc = s.scores[id]
  return sc ? Object.values(sc.byDay).reduce((a, b) => a + b, 0) : 0
}

/** Detecta subida de nível do perfil ativo e marca o burst pendente. */
function checkLevelUp(s: State) {
  const p = s.profiles.find((x) => x.id === s.activeId)
  if (!p) return
  const lv = levelFor(pointsOf(s, p.id))
  if (p.level == null) p.level = lv
  else if (lv > p.level) {
    p.level = lv
    s.pendingLevelUp = lv
  }
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
      pendingLevelUp: null,
      feedback: 'both',

      setActive: (id) => set((s) => { s.activeId = id }),
      setFeedback: (mode) => set((s) => { s.feedback = mode }),
      resetPoints: () => set((s) => { s.scores[s.activeId] = { byDay: {} } }),
      setDeco: (id) =>
        set((s) => {
          const p = s.profiles.find((x) => x.id === s.activeId)
          if (p) p.deco = id
        }),
      spinRoulette: () => {
        let won: string | null = null
        set((s) => {
          const p = s.profiles.find((x) => x.id === s.activeId)
          if (!p) return
          const stats = statsFor(s.history[p.id] ?? [], pointsOf(s, p.id), p.freezes ?? 0)
          const used = p.spinsUsed ?? 0
          if (earnedAchCount(stats) - used <= 0) return
          const owned = p.decos ?? []
          const pool = ALL_DECORATIONS.filter((d) => !owned.includes(d))
          if (!pool.length) return
          p.spinsUsed = used + 1
          won = pool[Math.floor(Math.random() * pool.length)]
          p.decos = [...owned, won]
        })
        return won
      },
      clearLevelUp: () => set((s) => { s.pendingLevelUp = null }),
      setSchedule: (days, time) =>
        set((s) => {
          const p = s.profiles.find((x) => x.id === s.activeId)
          if (p) p.schedule = { days, time }
        }),

      addCardio: (label, emoji) =>
        set((s) => {
          const id = s.activeId
          s.history[id] ??= []
          const today = todayISO()
          s.history[id].push({ date: today, w: 'cardio', t: label, emoji, pts: PTS_CARDIO })
          addPointsOn(s, id, today, PTS_CARDIO)
          checkLevelUp(s)
        }),

      updateProfile: (patch) =>
        set((s) => {
          const p = s.profiles.find((x) => x.id === s.activeId)
          if (p) Object.assign(p, patch)
        }),

      addProfile: () =>
        set((s) => {
          if (s.profiles.length >= 8) return
          const id = 'u' + Date.now()
          s.profiles.push({
            id,
            name: 'Novo perfil',
            color: COLORS[s.profiles.length % COLORS.length],
            photo: null,
            equipment: ['bodyweight', 'dumbbell'],
            plan: generatePlan(['bodyweight', 'dumbbell'], 'Geral'),
            theme: 'default',
            level: 1,
            freezes: 0,
            quests: { week: '', claimed: {} },
          })
          s.activeId = id
        }),

      deleteProfile: (id) =>
        set((s) => {
          if (s.profiles.length <= 1) return
          s.profiles = s.profiles.filter((p) => p.id !== id)
          if (s.activeId === id) s.activeId = s.profiles[0].id
          delete s.history[id]
          delete s.scores[id]
          delete s.sessions[id]
          delete s.measures[id]
        }),

      setPlan: (plan) =>
        set((s) => {
          const p = s.profiles.find((x) => x.id === s.activeId)
          if (p) {
            p.plan = plan
            if (s.sessions[p.id]) s.sessions[p.id] = {}
          }
        }),

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
          checkLevelUp(s)
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
          checkLevelUp(s)
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

      claimQuests: () =>
        set((s) => {
          const p = s.profiles.find((x) => x.id === s.activeId)
          if (!p) return
          const wk = weekStartISO()
          if (!p.quests) p.quests = { week: '', claimed: {} }
          if (p.quests.week !== wk) {
            p.quests.week = wk
            p.quests.claimed = {}
          }
          const hist = (s.history[p.id] ?? []).filter((e) => e.date >= wk)
          const prog: Record<string, number> = {
            treino: hist.filter((e) => e.w === 'A' || e.w === 'B' || e.w === 'C').length,
            cardio: hist.filter((e) => e.w === 'cardio').length,
            measure: (s.measures[p.id] ?? []).filter((m) => m.date >= wk).length,
          }
          for (const q of QUESTS) {
            if (!p.quests.claimed[q.id] && prog[q.kind] >= q.goal) {
              p.quests.claimed[q.id] = true
              addPointsOn(s, p.id, todayISO(), q.reward)
              if (q.freeze) p.freezes = (p.freezes ?? 0) + 1
            }
          }
          checkLevelUp(s)
        }),
    })),
    {
      name: 'home-gym-v2',
      version: 1,
      migrate: (persisted) => {
        const st = persisted as { profiles?: Array<Record<string, unknown>> } & Record<string, unknown>
        if (Array.isArray(st.profiles)) {
          st.profiles = st.profiles.map((p) => ({
            photo: null,
            equipment: ['bodyweight', 'dumbbell'],
            theme: 'default',
            level: 1,
            freezes: 0,
            quests: { week: '', claimed: {} },
            ...p,
          }))
        }
        return st as unknown as Store
      },
    },
  ),
)

export function totalPoints(scores: Record<string, Score>, id: string): number {
  const s = scores[id]
  if (!s) return 0
  return Object.values(s.byDay).reduce((a, b) => a + b, 0)
}
