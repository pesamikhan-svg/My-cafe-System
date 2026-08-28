import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useStaffStore } from '@/stores/useStaffStore'
import MainLayout from '@/components/layout/MainLayout'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import POS from '@/pages/POS'
import Tables from '@/pages/Tables'
import Reservations from '@/pages/Reservations'
import Customers from '@/pages/Customers'
import Payments from '@/pages/Payments'
import Reports from '@/pages/Reports'
import Settings from '@/pages/Settings'
import StaffPage from '@/pages/StaffPage'
import StaffProfile from '@/pages/StaffProfile'
import AttendancePage from '@/pages/AttendancePage'
import SalaryPage from '@/pages/SalaryPage'
import PayrollPage from '@/pages/PayrollPage'
import ProfitLoss from '@/pages/ProfitLoss'
import OrderHistory from '@/pages/OrderHistory'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const currentUser = useStaffStore((s) => s.currentUser)
  if (!currentUser) return <Navigate to="/login" replace />
  return <>{children}</>
}

function useIsAdmin() {
  const user = useStaffStore((s) => s.currentUser)
  return user?.role === 'admin'
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const isAdmin = useIsAdmin()
  if (!isAdmin) return <Navigate to="/" replace />
  return <>{children}</>
}

export default function App() {
  const currentUser = useStaffStore((s) => s.currentUser)

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={currentUser ? <Navigate to="/" replace /> : <Login />} />
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pos" element={<POS />} />
          <Route path="/tables" element={<Tables />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<AdminRoute><Settings /></AdminRoute>} />
          <Route path="/staff" element={<AdminRoute><StaffPage /></AdminRoute>} />
          <Route path="/staff/:id" element={<AdminRoute><StaffProfile /></AdminRoute>} />
          <Route path="/attendance" element={<AdminRoute><AttendancePage /></AdminRoute>} />
          <Route path="/salary" element={<AdminRoute><SalaryPage /></AdminRoute>} />
          <Route path="/payroll" element={<AdminRoute><PayrollPage /></AdminRoute>} />
          <Route path="/profit-loss" element={<AdminRoute><ProfitLoss /></AdminRoute>} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
