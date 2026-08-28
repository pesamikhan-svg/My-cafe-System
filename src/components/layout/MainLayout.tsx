import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import { useSidebarStore, SIDEBAR_EXPANDED_WIDTH, SIDEBAR_COLLAPSED_WIDTH } from '@/stores/useSidebarStore'
import { useStaffStore } from '@/stores/useStaffStore'
import { useProductStore } from '@/stores/useProductStore'
import { useProfitStore } from '@/stores/useProfitStore'

export default function MainLayout() {
  const expanded = useSidebarStore((s) => s.expanded)
  const sidebarWidth = expanded ? SIDEBAR_EXPANDED_WIDTH : SIDEBAR_COLLAPSED_WIDTH
  const staffInit = useStaffStore((s) => s.init)
  const productInit = useProductStore((s) => s.init)
  const profitInit = useProfitStore((s) => s.init)

  useEffect(() => {
    staffInit()
    productInit()
    profitInit()
  }, [staffInit, productInit, profitInit])

  return (
    <div
      className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950"
      style={{ '--sidebar-width': `${sidebarWidth}px` } as React.CSSProperties}
    >
      <Sidebar />
      <div
        className="flex flex-col flex-1 min-w-0 transition-[margin] duration-300 ease-in-out"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        <Header />
        <main className="flex-1 min-h-0 flex flex-col">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
