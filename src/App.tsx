import { useEffect, useState } from 'react'
import { useStore } from '@/store'
import { applyTheme } from '@/lib/themes'
import { Header } from '@/components/Header'
import { WorkoutScreen } from '@/components/WorkoutScreen'
import { HistoryModal } from '@/components/HistoryModal'
import { MeasuresModal } from '@/components/MeasuresModal'
import { ChartsModal } from '@/components/ChartsModal'
import { RewardsModal } from '@/components/RewardsModal'
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

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  return (
    <div className="mx-auto min-h-full max-w-md px-5 pb-10">
      <Header
        onOpenHistory={() => setHistOpen(true)}
        onOpenRewards={() => setRewardsOpen(true)}
      />
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
      <RewardsModal open={rewardsOpen} onClose={() => setRewardsOpen(false)} />
      <LevelUpBurst />
      <Toaster />
    </div>
  )
}
