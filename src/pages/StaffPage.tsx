import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useStaffStore } from '@/stores/useStaffStore'
import { formatCurrency } from '@/lib/utils'
import StaffForm from '@/components/staff/StaffForm'
import { StaffFormData } from '@/types'
import {
  Plus,
  Search,
  Users,
  UserCheck,
  UserCog,
  UserX,
  DollarSign,
  Edit2,
  Trash2,
  Eye,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function StaffPage() {
  const { staff, addStaff, updateStaff, removeStaff } = useStaffStore()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingStaff, setEditingStaff] = useState<string | null>(null)

  const activeStaff = staff.filter((s) => s.isActive)
  const filtered = activeStaff.filter(
    (s) =>
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.position.toLowerCase().includes(search.toLowerCase()) ||
      s.staffId.toLowerCase().includes(search.toLowerCase())
  )

  const totalSalary = activeStaff.reduce((sum, s) => sum + s.basicSalary, 0)
  const admins = activeStaff.filter((s) => s.role === 'admin').length
  const cashiers = activeStaff.filter((s) => s.role === 'cashier').length
  const regular = activeStaff.filter((s) => s.role === 'staff').length

  const handleSubmit = (data: StaffFormData) => {
    if (editingStaff) {
      updateStaff(editingStaff, data)
    } else {
      addStaff(data)
    }
    setShowForm(false)
    setEditingStaff(null)
  }

  const handleEdit = (id: string) => {
    setEditingStaff(id)
    setShowForm(true)
  }

  const editingData = editingStaff ? staff.find((s) => s.id === editingStaff) : null

  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Staff Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your cafe staff members</p>
        </div>
        <Button onClick={() => { setEditingStaff(null); setShowForm(true) }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Staff
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-accent/5">
                <Users className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Staff</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeStaff.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-green-50 dark:bg-green-500/10">
                <UserCheck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Staff</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{regular}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10">
                <UserCog className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Cashiers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{cashiers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-500/10">
                <UserX className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Admins</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{admins}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-500/10">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Monthly Salary</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalSalary)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Staff Directory</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search staff..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700/50">
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Staff ID</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">CNIC</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Basic Salary</th>
                  <th className="text-center px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-4 text-sm font-mono text-gray-500">{s.staffId}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                          <span className="text-accent text-xs font-bold">
                            {s.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{s.fullName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant="outline" className="text-xs">{s.position}</Badge>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">{s.phone}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{s.cnic}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-right">{formatCurrency(s.basicSalary)}</td>
                    <td className="px-5 py-4 text-center">
                      <Badge variant={s.role === 'admin' ? 'default' : s.role === 'cashier' ? 'warning' : 'secondary'} className="text-xs capitalize">
                        {s.role}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => navigate(`/staff/${s.id}`)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => handleEdit(s.id)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="w-8 h-8 text-red-500 hover:text-red-600" onClick={() => { if (window.confirm('Are you sure you want to remove this staff member?')) removeStaff(s.id) }}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center text-gray-500">
                      No staff members found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {showForm && (
        <StaffForm
          onSubmit={handleSubmit}
          onClose={() => { setShowForm(false); setEditingStaff(null) }}
          initialData={editingData ? {
            fullName: editingData.fullName,
            email: editingData.email,
            phone: editingData.phone,
            cnic: editingData.cnic,
            address: editingData.address,
            joiningDate: editingData.joiningDate,
            position: editingData.position,
            basicSalary: editingData.basicSalary,
            profilePhoto: editingData.profilePhoto,
            isAdmin: editingData.isAdmin,
            role: editingData.role,
          } : undefined}
        />
      )}
    </div>
  )
}
