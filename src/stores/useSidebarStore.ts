import { create } from 'zustand'

export const SIDEBAR_EXPANDED_WIDTH = 260
export const SIDEBAR_COLLAPSED_WIDTH = 72

function getInitialState(): boolean {
  try {
    const saved = localStorage.getItem('sidebar-expanded')
    return saved !== null ? JSON.parse(saved) : true
  } catch {
    return true
  }
}

interface SidebarStore {
  expanded: boolean
  mobileOpen: boolean
  toggle: () => void
  setExpanded: (v: boolean) => void
  setMobileOpen: (v: boolean) => void
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  expanded: getInitialState(),
  mobileOpen: false,
  toggle: () =>
    set((state) => {
      const next = !state.expanded
      localStorage.setItem('sidebar-expanded', JSON.stringify(next))
      return { expanded: next }
    }),
  setExpanded: (v) => {
    localStorage.setItem('sidebar-expanded', JSON.stringify(v))
    set({ expanded: v })
  },
  setMobileOpen: (v) => set({ mobileOpen: v }),
}))
