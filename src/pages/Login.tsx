import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStaffStore } from '@/stores/useStaffStore'
import { Coffee, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react'

const CREDENTIALS: Record<string, string> = {
  'admin@cafe.com': 'admin123',
  'cashier@cafe.com': 'cashier123',
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const staff = useStaffStore((s) => s.staff)
  const loaded = useStaffStore((s) => s.loaded)
  const setCurrentUser = useStaffStore((s) => s.setCurrentUser)
  const init = useStaffStore((s) => s.init)

  useEffect(() => {
    if (!loaded) init().catch((err) => console.error('init error:', err))
  }, [init, loaded])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please enter email and password')
      return
    }

    const expected = CREDENTIALS[email.toLowerCase()]
    if (!expected) {
      setError('Invalid credentials')
      return
    }

    if (password !== expected) {
      setError('Invalid credentials')
      return
    }

    setLoading(true)
    try {
      if (!useStaffStore.getState().loaded) await init()

      const allStaff = useStaffStore.getState().staff
      const user = allStaff.find((s) => s.email?.toLowerCase() === email.toLowerCase())
      if (!user) {
        setError('User not found')
        setLoading(false)
        return
      }

      setCurrentUser(user)
      navigate('/', { replace: true })
    } catch (err) {
      console.error('login error:', err)
      setError('Failed to load data. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-accent mb-4">
              <Coffee className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Cafe POS</h1>
            <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@cafe.com"
                className="flex h-10 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="flex h-10 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-3 py-2 pr-10 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl px-3 py-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <><Loader2 className="w-4 h-4 inline animate-spin mr-2" />Signing in...</> : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs text-gray-400 text-center mb-3">Demo Accounts</p>
            <div className="space-y-2 text-xs text-gray-500">
              <div className="flex justify-between">
                <span>Admin</span>
                <span className="text-gray-400">admin@cafe.com / admin123</span>
              </div>
              <div className="flex justify-between">
                <span>Cashier</span>
                <span className="text-gray-400">cashier@cafe.com / cashier123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
