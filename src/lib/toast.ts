import { create } from 'zustand'

type ToastState = {
  msg: string | null
  show: (m: string) => void
}

let timer: ReturnType<typeof setTimeout> | null = null

export const useToast = create<ToastState>((set) => ({
  msg: null,
  show: (m) => {
    set({ msg: m })
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => set({ msg: null }), 2600)
  },
}))
