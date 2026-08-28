import { NavLink, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  ShoppingCart,
  Table2,
  CalendarCheck,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  Coffee,
  UserCircle,
  ClipboardCheck,
  Wallet,
  Receipt,
  TrendingUp,
  ChevronDown,
  Menu,
  X,
  ChevronLeft,
  History,
} from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { useStaffStore } from '@/stores/useStaffStore'
import { useSidebarStore, SIDEBAR_EXPANDED_WIDTH, SIDEBAR_COLLAPSED_WIDTH } from '@/stores/useSidebarStore'
import * as db from '@/lib/db-api'

const cashierMenuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { id: 'pos', label: 'POS', icon: ShoppingCart, path: '/pos' },
  { id: 'tables', label: 'Tables', icon: Table2, path: '/tables' },
  { id: 'reservations', label: 'Reservations', icon: CalendarCheck, path: '/reservations' },
  { id: 'customers', label: 'Customers', icon: Users, path: '/customers' },
  { id: 'payments', label: 'Payments', icon: CreditCard, path: '/payments' },
  { id: 'orders', label: 'Order History', icon: History, path: '/orders' },
  { id: 'reports', label: 'Reports', icon: BarChart3, path: '/reports' },
]

const adminMenuItems = [
  ...cashierMenuItems,
  { id: 'profit-loss', label: 'Profit & Loss', icon: TrendingUp, path: '/profit-loss' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
]

const staffItems = [
  { id: 'staff', label: 'Staff', icon: UserCircle, path: '/staff' },
  { id: 'attendance', label: 'Attendance', icon: ClipboardCheck, path: '/attendance' },
  { id: 'salary', label: 'Salary', icon: Wallet, path: '/salary' },
  { id: 'payroll', label: 'Payroll', icon: Receipt, path: '/payroll' },
]

function NavItem({
  item,
  collapsed,
  onClick,
}: {
  item: (typeof cashierMenuItems)[number]
  collapsed: boolean
  onClick?: () => void
}) {
  return (
    <NavLink
      to={item.path}
      onClick={onClick}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        cn(
          'relative flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200 group',
          collapsed ? 'justify-center px-0 py-3 mx-2' : 'px-3 py-2.5 mx-2',
          isActive
            ? 'bg-accent/10 text-accent'
            : 'text-gray-400 hover:text-white hover:bg-white/5'
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <div className={cn(
              'absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-accent transition-opacity',
              collapsed && 'opacity-0'
            )} />
          )}
          <div
            className={cn(
              'flex items-center justify-center w-9 h-9 rounded-lg shrink-0 transition-all duration-200',
              isActive
                ? 'bg-accent text-white shadow-sm shadow-accent/20'
                : 'bg-transparent group-hover:bg-white/5 text-gray-400 group-hover:text-white'
            )}
          >
            <item.icon className="w-[18px] h-[18px]" />
          </div>
          <span
            className={cn(
              'truncate transition-opacity duration-200',
              collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
            )}
          >
            {item.label}
          </span>
        </>
      )}
    </NavLink>
  )
}

export default function Sidebar() {
  const [staffOpen, setStaffOpen] = useState(true)
  const [storeName, setStoreName] = useState('Cafe POS')
  const location = useLocation()
  const currentUser = useStaffStore((s) => s.currentUser)
  const { expanded, mobileOpen, toggle, setMobileOpen } = useSidebarStore()

  useEffect(() => {
    db.metaGet('storeName').then((name) => { if (name) setStoreName(name) })
  }, [])
  const isAdmin = currentUser?.role === 'admin'
  const menuItems = isAdmin ? adminMenuItems : cashierMenuItems
  const isStaffRoute = (path: string) =>
    path === '/staff' || path === '/attendance' || path === '/salary' || path === '/payroll'

  const closeMobile = useCallback(() => setMobileOpen(false), [setMobileOpen])

  useEffect(() => {
    closeMobile()
  }, [location.pathname, closeMobile])

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={closeMobile}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen bg-sidebar flex flex-col transition-all duration-300 ease-in-out',
          'lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        style={{ width: mobileOpen ? SIDEBAR_EXPANDED_WIDTH : (expanded ? SIDEBAR_EXPANDED_WIDTH : SIDEBAR_COLLAPSED_WIDTH) }}
      >
        {/* Header */}
        <div
          className={cn(
            'flex items-center h-16 shrink-0 border-b border-gray-700/40 transition-all duration-300',
            expanded || mobileOpen ? 'gap-3 px-5' : 'gap-0 px-[18px]'
          )}
        >
          <button
            onClick={toggle}
            className="flex items-center justify-center w-9 h-9 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all shrink-0 lg:flex hidden"
          >
            <ChevronLeft className={cn('w-[18px] h-[18px] transition-transform duration-300', !expanded && 'rotate-180')} />
          </button>
          <button
            onClick={closeMobile}
            className="flex items-center justify-center w-9 h-9 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all shrink-0 lg:hidden"
          >
            <X className="w-[18px] h-[18px]" />
          </button>
          <div className={cn('flex items-center', expanded || mobileOpen ? 'gap-2.5' : 'gap-0')}>
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-accent shrink-0">
              <Coffee className="w-5 h-5 text-white" />
            </div>
            <div className={cn('overflow-hidden transition-all duration-300', expanded || mobileOpen ? 'w-auto opacity-100 ml-0' : 'w-0 opacity-0 ml-0')}>
              <h1 className="text-white font-bold text-[15px] leading-tight whitespace-nowrap">{storeName}</h1>
              <p className="text-gray-500 text-[10px] leading-tight whitespace-nowrap tracking-wide">Management System</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 space-y-0.5">
          {menuItems.map((item) => (
            <NavItem key={item.id} item={item} collapsed={!expanded && !mobileOpen} onClick={closeMobile} />
          ))}

          {isAdmin && (expanded || mobileOpen) && (
            <div className="pt-3 mt-3 border-t border-gray-700/30">
              <button
                onClick={() => setStaffOpen(!staffOpen)}
                className={cn(
                  'flex items-center gap-3 w-full px-5 py-2.5 text-sm font-medium transition-all duration-200 group',
                  isStaffRoute(location.pathname)
                    ? 'text-accent'
                    : 'text-gray-400 hover:text-white'
                )}
              >
                <div className={cn(
                  'flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200',
                  isStaffRoute(location.pathname) ? 'bg-accent text-white shadow-sm shadow-accent/20' : 'bg-transparent group-hover:bg-white/5 text-gray-400 group-hover:text-white'
                )}>
                  <UserCircle className="w-[18px] h-[18px]" />
                </div>
                <span className="flex-1 text-left truncate">Staff Management</span>
                <ChevronDown className={cn('w-4 h-4 transition-transform duration-200 shrink-0', staffOpen && 'rotate-180')} />
              </button>

              <div className={cn(
                'overflow-hidden transition-all duration-200',
                staffOpen ? 'max-h-60 opacity-100 mt-0.5' : 'max-h-0 opacity-0'
              )}>
                <div className="ml-3 space-y-0.5 border-l border-gray-700/30 pl-2">
                  {staffItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <NavLink
                        key={item.id}
                        to={item.path}
                        onClick={closeMobile}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                            isActive
                              ? 'bg-accent/10 text-accent'
                              : 'text-gray-400 hover:text-white hover:bg-white/5'
                          )
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <div className={cn(
                              'flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-200 shrink-0',
                              isActive ? 'bg-accent text-white' : 'bg-transparent'
                            )}>
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <span className="truncate">{item.label}</span>
                          </>
                        )}
                      </NavLink>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {isAdmin && !expanded && !mobileOpen && (
            <div className="flex justify-center pt-3 mt-3 border-t border-gray-700/30">
              <div
                className={cn(
                  'flex items-center justify-center w-9 h-9 rounded-lg transition-all cursor-default',
                  isStaffRoute(location.pathname)
                    ? 'bg-accent text-white shadow-sm shadow-accent/20'
                    : 'text-gray-400'
                )}
                title="Staff Management"
              >
                <UserCircle className="w-[18px] h-[18px]" />
              </div>
            </div>
          )}
        </nav>

        {/* User section */}
        <div className="shrink-0 border-t border-gray-700/40 px-4 py-3">
          <div className={cn(
            'flex items-center',
            expanded || mobileOpen ? 'gap-3' : 'justify-center'
          )}>
            <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
              <span className="text-accent text-xs font-bold">
                {currentUser?.fullName?.charAt(0)?.toUpperCase() || '?'}
              </span>
            </div>
            <div className={cn(
              'overflow-hidden transition-all duration-300',
              expanded || mobileOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'
            )}>
              <p className="text-white text-sm font-medium truncate leading-tight">{currentUser?.fullName || 'User'}</p>
              <p className="text-gray-500 text-[11px] capitalize truncate leading-tight mt-0.5">{currentUser?.role || ''}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(true)}
        className={cn(
          'fixed top-3 left-3 z-30 flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 lg:hidden transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700',
          mobileOpen && 'hidden'
        )}
      >
        <Menu className="w-5 h-5" />
      </button>
    </>
  )
}
