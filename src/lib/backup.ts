import { useStore, todayISO } from '@/store'
import type { Profile } from '@/types'

function backfillProfiles(profiles: Array<Record<string, unknown>>): Profile[] {
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

export function exportBackup() {
  const s = useStore.getState()
  const data = {
    profiles: s.profiles,
    activeId: s.activeId,
    history: s.history,
    scores: s.scores,
    sessions: s.sessions,
    measures: s.measures,
    feedback: s.feedback,
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `home-gym-backup-${todayISO()}.json`
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function importBackup(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    const r = new FileReader()
    r.onload = () => {
      try {
        const data = JSON.parse(r.result as string) as Record<string, unknown>
        if (!Array.isArray(data.profiles)) return resolve(false)
        useStore.setState({
          profiles: backfillProfiles(data.profiles as Array<Record<string, unknown>>),
          activeId: (data.activeId as string) ?? useStore.getState().activeId,
          history: (data.history as never) ?? {},
          scores: (data.scores as never) ?? {},
          sessions: (data.sessions as never) ?? {},
          measures: (data.measures as never) ?? {},
          feedback: (data.feedback as never) ?? 'both',
        })
        resolve(true)
      } catch {
        resolve(false)
      }
    }
    r.onerror = () => resolve(false)
    r.readAsText(file)
  })
}
