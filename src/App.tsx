import { useEffect, useState } from 'react'
import { useStore } from '@/store'
import { applyTheme } from '@/lib/themes'
import { initSync } from '@/lib/sync'
import { Header } from '@/components/Header'
import { CloudModal } from '@/components/CloudModal'
import { WorkoutScreen } from '@/components/WorkoutScreen'
import { HistoryModal } from '@/components/HistoryModal'
import { MeasuresModal } from '@/components/MeasuresModal'
import { ChartsModal } from '@/components/ChartsModal'
import { RewardsModal } from '@/components/RewardsModal'
import { AgendaModal } from '@/components/AgendaModal'
import { TodayBanner } from '@/components/TodayBanner'
import { CardioBar } from '@/components/CardioBar'
import { LevelUpBurst } from '@/components/LevelUpBurst'
import { Toaster } from '@/components/ui/Toaster'

export default function App() {
  const theme = useStore(
    (s) => s.profiles.find((p) => p.id === s.activeId)?.theme ?? 'default',
  )
  const [histOpen, setHistOpen] = useState(false)
  const [measuresOpen, setMeasuresOpen] = useState(false)
  const [chartsOpen, setChartsOpen] = useState(false)
  const [rewardsOpen, setRewardsOpen] = useState(false)
  const [cloudOpen, setCloudOpen] = useState(false)
  const [agendaOpen, setAgendaOpen] = useState(false)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    void initSync()
  }, [])

  return (
    <div className="mx-auto min-h-full max-w-md px-5 pb-10">
      <Header
        onOpenHistory={() => setHistOpen(true)}
        onOpenRewards={() => setRewardsOpen(true)}
        onOpenCloud={() => setCloudOpen(true)}
      />
      <TodayBanner />
      <CardioBar />
      <main className="mt-4">
        <WorkoutScreen />
      </main>

      <HistoryModal
        open={histOpen}
        onClose={() => setHistOpen(false)}
        onOpenMeasures={() => setMeasuresOpen(true)}
        onOpenCharts={() => setChartsOpen(true)}
      />
      <MeasuresModal open={measuresOpen} onClose={() => setMeasuresOpen(false)} />
      <ChartsModal open={chartsOpen} onClose={() => setChartsOpen(false)} />
      <RewardsModal
        open={rewardsOpen}
        onClose={() => setRewardsOpen(false)}
        onOpenAgenda={() => setAgendaOpen(true)}
      />
      <AgendaModal open={agendaOpen} onClose={() => setAgendaOpen(false)} />
      <CloudModal open={cloudOpen} onClose={() => setCloudOpen(false)} />
      <LevelUpBurst />
      <Toaster />
    </div>
  )
}
