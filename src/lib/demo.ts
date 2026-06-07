import { create } from 'zustand'

type Demo = { nome: string; musculo: string }

export const useDemo = create<{
  ex: Demo | null
  open: (e: Demo) => void
  close: () => void
}>((set) => ({
  ex: null,
  open: (ex) => set({ ex }),
  close: () => set({ ex: null }),
}))
