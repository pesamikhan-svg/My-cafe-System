import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useStaffStore } from '@/stores/useStaffStore'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ArrowLeft, Mail, Phone, MapPin, Calendar, DollarSign, Briefcase, Clock, CheckCircle, XCircle } from 'lucide-react'

export default function StaffProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const staff = useStaffStore((s) => s.staff)
  const attendance = useStaffStore((s) => s.attendance)
  const salaries = useStaffStore((s) => s.salaries)
  const loadAttendance = useStaffStore((s) => s.loadAttendance)

  const member = staff.find((s) => s.id === id)
  if (!member) {
    return (
      <div className="flex-1 min-h-0 overflow-y-auto p-6 animate-fade-in">
        <p className="text-gray-500">Staff member not found.</p>
        <Button variant="outline" onClick={() => navigate('/staff')} className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
      </div>
    )
  }

  const today = new Date()
  const currentMonth = today.getMonth() + 1
  const currentYear = today.getFullYear()

  useEffect(() => {
    if (member) loadAttendance(member.id, currentMonth, currentYear)
  }, [member?.id, currentMonth, currentYear])

  const staffAttendance = attendance.filter(
    (a) => a.staffId === member.id &&
      new Date(a.date).getMonth() === currentMonth - 1 &&
      new Date(a.date).getFullYear() === currentYear
  )
  const present = staffAttendance.filter((a) => a.status === 'present').length
  const absent = staffAttendance.filter((a) => a.status === 'absent').length
  const leaves = staffAttendance.filter((a) => a.status === 'leave').length

  const salaryRecord = salaries.find(
    (s) => s.staffId === member.id && s.month === currentMonth && s.year === currentYear
  )

  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6 animate-fade-in">
      <Button variant="ghost" onClick={() => navigate('/staff')} className="mb-2">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Staff
      </Button>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
              <span className="text-accent text-2xl font-bold">
                {member.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{member.fullName}</h1>
                <Badge variant={member.role === 'admin' ? 'default' : 'secondary'}>
                  {member.role === 'admin' ? 'Admin' : member.role === 'cashier' ? 'Cashier' : 'Staff'}
                </Badge>
                <Badge variant={member.isActive ? 'success' : 'destructive'}>
                  {member.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Briefcase className="w-4 h-4" /> {member.position}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <DollarSign className="w-4 h-4" /> {formatCurrency(member.basicSalary)}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" /> Joined {formatDate(member.joiningDate)}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" /> ID: {member.staffId}
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-700/50">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">{member.email || 'No email'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">{member.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">{member.address || 'No address'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400 font-medium">CNIC:</span>
              <span className="text-gray-600 dark:text-gray-400">{member.cnic}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">This Month Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-xl bg-green-50 dark:bg-green-500/10">
                <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-green-600">{present}</p>
                <p className="text-xs text-gray-500">Present</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-red-50 dark:bg-red-500/10">
                <XCircle className="w-6 h-6 text-red-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-red-600">{absent}</p>
                <p className="text-xs text-gray-500">Absent</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-yellow-50 dark:bg-yellow-500/10">
                <Clock className="w-6 h-6 text-yellow-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-yellow-600">{leaves}</p>
                <p className="text-xs text-gray-500">Leaves</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Current Month Salary</CardTitle>
          </CardHeader>
          <CardContent>
            {salaryRecord ? (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Basic Salary</span>
                  <span className="font-medium">{formatCurrency(salaryRecord.basicSalary)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Overtime Pay</span>
                  <span className="font-medium">{formatCurrency(salaryRecord.overtimePay)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Bonuses</span>
                  <span className="font-medium text-green-600">{formatCurrency(salaryRecord.bonuses)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Allowances</span>
                  <span className="font-medium">{formatCurrency(salaryRecord.allowances)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Deductions</span>
                  <span className="font-medium text-red-600">-{formatCurrency(salaryRecord.deductions)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Late Penalties</span>
                  <span className="font-medium text-red-600">-{formatCurrency(salaryRecord.latePenalties)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-sm font-bold">
                  <span>Total</span>
                  <span className="text-accent">{formatCurrency(salaryRecord.totalSalary)}</span>
                </div>
                <div className="mt-2">
                  <Badge variant={salaryRecord.paid ? 'success' : 'warning'}>
                    {salaryRecord.paid ? 'Paid' : 'Pending'}
                  </Badge>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No salary record for this month.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
