import type { Session as AuthSession } from '@supabase/supabase-js'
import { create } from 'zustand'
import { supabase } from './supabase'
import { useStore } from '@/store'
import type { HistoryEntry, Measure, Profile, Score, Session } from '@/types'

/** Estado de autenticação observável pela UI. */
export const useAuth = create<{ email: string | null; ready: boolean }>(() => ({
  email: null,
  ready: false,
}))

type SyncData = {
  profiles: Profile[]
  activeId: string
  history: Record<string, HistoryEntry[]>
  scores: Record<string, Score>
  sessions: Record<string, Record<string, Session>>
  measures: Record<string, Measure[]>
}

function snapshot(): SyncData {
  const s = useStore.getState()
  return {
    profiles: s.profiles,
    activeId: s.activeId,
    history: s.history,
    scores: s.scores,
    sessions: s.sessions,
    measures: s.measures,
  }
}

/** Garante os campos novos nos perfis vindos da nuvem (robustez). */
function hydrateProfiles(profiles: Array<Record<string, unknown>>): Profile[] {
  return profiles.map((p) => ({
    photo: null,
    equipment: ['bodyweight', 'dumbbell'],
    theme: 'default',
    level: 1,
    freezes: 0,
    quests: { week: '', claimed: {} },
    ...p,
  })) as Profile[]
}

let currentUserId: string | null = null
let pushTimer: ReturnType<typeof setTimeout> | null = null
let unsub: (() => void) | null = null
let hydrating = false

async function pull() {
  if (!currentUserId) return
  const { data, error } = await supabase
    .from('app_state_v2')
    .select('data')
    .eq('user_id', currentUserId)
    .maybeSingle()
  if (error) return
  const remote = data?.data as Partial<SyncData> | undefined
  if (remote && Array.isArray(remote.profiles)) {
    hydrating = true
    useStore.setState({
      profiles: hydrateProfiles(remote.profiles as unknown as Array<Record<string, unknown>>),
      activeId: remote.activeId ?? useStore.getState().activeId,
      history: remote.history ?? {},
      scores: remote.scores ?? {},
      sessions: remote.sessions ?? {},
      measures: remote.measures ?? {},
    })
    hydrating = false
  } else {
    pushNow()
  }
}

function pushNow() {
  if (!currentUserId) return
  void supabase
    .from('app_state_v2')
    .upsert({ user_id: currentUserId, data: snapshot(), updated_at: new Date().toISOString() })
}

function schedulePush() {
  if (!currentUserId || hydrating) return
  if (pushTimer) clearTimeout(pushTimer)
  pushTimer = setTimeout(pushNow, 1500)
}

async function onSession(session: AuthSession | null) {
  const uid = session?.user?.id ?? null
  useAuth.setState({ email: session?.user?.email ?? null, ready: true })
  if (uid === currentUserId) return
  currentUserId = uid
  if (unsub) {
    unsub()
    unsub = null
  }
  if (uid) {
    await pull()
    unsub = useStore.subscribe(() => schedulePush())
  }
}

export async function initSync() {
  const { data } = await supabase.auth.getSession()
  await onSession(data.session)
  supabase.auth.onAuthStateChange((_event, session) => {
    void onSession(session)
  })
}

export function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password })
}
export function signOut() {
  return supabase.auth.signOut()
}
