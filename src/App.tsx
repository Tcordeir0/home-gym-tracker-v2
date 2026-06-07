import { useEffect, useState } from 'react'
import { useStore } from '@/store'
import { applyTheme } from '@/lib/themes'
import { Header } from '@/components/Header'
import { WorkoutScreen } from '@/components/WorkoutScreen'
import { HistoryModal } from '@/components/HistoryModal'
import { Toaster } from '@/components/ui/Toaster'

export default function App() {
  const theme = useStore(
    (s) => s.profiles.find((p) => p.id === s.activeId)?.theme ?? 'default',
  )
  const [histOpen, setHistOpen] = useState(false)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  return (
    <div className="mx-auto min-h-full max-w-md px-5 pb-10">
      <Header onOpenHistory={() => setHistOpen(true)} />
      <main className="mt-4">
        <WorkoutScreen />
      </main>
      <HistoryModal open={histOpen} onClose={() => setHistOpen(false)} />
      <Toaster />
    </div>
  )
}
