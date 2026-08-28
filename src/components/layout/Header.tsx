import { Bell, Sun, Moon, LogOut } from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStaffStore } from '@/stores/useStaffStore'

export default function Header() {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')
  const currentUser = useStaffStore((s) => s.currentUser)
  const setCurrentUser = useStaffStore((s) => s.setCurrentUser)
  const navigate = useNavigate()

  useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  const handleLogout = () => {
    setCurrentUser(null)
    navigate('/login', { replace: true })
  }

  const initials = currentUser?.fullName
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || '?'

  return (
    <header className="sticky top-0 z-30 h-14 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-6 shrink-0">
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="relative text-gray-500 hover:text-accent hover:bg-accent/5 w-9 h-9"
          onClick={() => setDark(!dark)}
        >
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="relative text-gray-500 hover:text-accent hover:bg-accent/5 w-9 h-9"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
        </Button>

        <div className="flex items-center gap-2.5 pl-3 border-l border-gray-200 dark:border-gray-700 ml-1">
          <Avatar
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.fullName || 'User')}&background=F97316&color=fff`}
            alt={currentUser?.fullName || 'User'}
            fallback={initials}
          />
          <div className="hidden sm:block leading-tight">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{currentUser?.fullName || 'User'}</p>
            <p className="text-[11px] text-gray-500 capitalize">{currentUser?.role || ''}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 w-9 h-9 ml-1"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
