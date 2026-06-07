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
import { ProfileEditorModal } from '@/components/ProfileEditorModal'
import { GeneratorModal } from '@/components/GeneratorModal'
import { SettingsModal } from '@/components/SettingsModal'
import { ShareModal } from '@/components/ShareModal'
import { TodayBanner } from '@/components/TodayBanner'
import { CardioBar } from '@/components/CardioBar'
import { DemoModal } from '@/components/DemoModal'
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
  const [editorOpen, setEditorOpen] = useState(false)
  const [generatorOpen, setGeneratorOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const addProfile = useStore((s) => s.addProfile)

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
        onOpenEditor={() => setEditorOpen(true)}
        onAddProfile={() => {
          addProfile()
          setEditorOpen(true)
        }}
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
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenShare={() => setShareOpen(true)}
      />
      <AgendaModal open={agendaOpen} onClose={() => setAgendaOpen(false)} />
      <ProfileEditorModal
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        onOpenGenerator={() => setGeneratorOpen(true)}
      />
      <GeneratorModal open={generatorOpen} onClose={() => setGeneratorOpen(false)} />
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} />
      <CloudModal open={cloudOpen} onClose={() => setCloudOpen(false)} />
      <DemoModal />
      <LevelUpBurst />
      <Toaster />
    </div>
  )
}
