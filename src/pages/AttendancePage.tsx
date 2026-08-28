import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useStaffStore } from '@/stores/useStaffStore'
import { getMonthName, exportToCSV } from '@/lib/utils'
import { Attendance, AttendanceStatus } from '@/types'
import {
  CheckCircle2,
  XCircle,
  Clock,
  CalendarDays,
  Download,
} from 'lucide-react'

const statusColors: Record<AttendanceStatus, string> = {
  present: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  absent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
  leave: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
}

export default function AttendancePage() {
  const today = new Date()
  const staff = useStaffStore((s) => s.staff)
  const attendance = useStaffStore((s) => s.attendance)
  const markAttendance = useStaffStore((s) => s.markAttendance)
  const loadAttendance = useStaffStore((s) => s.loadAttendance)
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1)
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedStaff, setSelectedStaff] = useState('all')

  const activeStaff = staff.filter((s) => s.isActive)

  useEffect(() => {
    activeStaff.forEach((s) => loadAttendance(s.id, currentMonth, currentYear))
  }, [currentMonth, currentYear, staff.length])

  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate()
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  const filteredStaff = selectedStaff === 'all'
    ? activeStaff
    : activeStaff.filter((s) => s.id === selectedStaff)

  const getAttendance = (staffId: string, day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return attendance.find((a) => a.staffId === staffId && a.date === dateStr)
  }

  const toggleStatus = (staffId: string, day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const existing = getAttendance(staffId, day)
    const statuses: AttendanceStatus[] = ['present', 'absent', 'leave']
    const nextStatus = existing
      ? statuses[(statuses.indexOf(existing.status) + 1) % statuses.length]
      : 'present'
    const record: Attendance = {
      id: existing?.id || `att-${staffId}-${day}`,
      staffId,
      date: dateStr,
      status: nextStatus,
      checkIn: nextStatus === 'present' ? '09:00' : undefined,
      checkOut: nextStatus === 'present' ? '18:00' : undefined,
      hoursWorked: nextStatus === 'present' ? 9 : undefined,
    }
    markAttendance(record)
  }

  const prevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12)
      setCurrentYear((y) => y - 1)
    } else {
      setCurrentMonth((m) => m - 1)
    }
  }

  const nextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1)
      setCurrentYear((y) => y + 1)
    } else {
      setCurrentMonth((m) => m + 1)
    }
  }

  const exportCSV = () => {
    const data = filteredStaff.flatMap((s) =>
      days.map((day) => {
        const att = getAttendance(s.id, day)
        return {
          'Staff ID': s.staffId,
          Name: s.fullName,
          Date: `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
          Status: att?.status || 'N/A',
          'Check In': att?.checkIn || '-',
          'Check Out': att?.checkOut || '-',
          'Hours Worked': att?.hoursWorked || 0,
        }
      })
    )
    exportToCSV(data, `attendance-${currentMonth}-${currentYear}`)
  }

  const totals = filteredStaff.map((s) => {
    const staffDays = days.map((d) => getAttendance(s.id, d))
    return {
      name: s.fullName,
      present: staffDays.filter((a) => a?.status === 'present').length,
      absent: staffDays.filter((a) => a?.status === 'absent').length,
      leave: staffDays.filter((a) => a?.status === 'leave').length,
    }
  })

  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance Management</h1>
          <p className="text-sm text-gray-500 mt-1">Track daily check in / check out and attendance</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={exportCSV}>
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={prevMonth}>&larr; Prev</Button>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-accent" />
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              {getMonthName(currentMonth)} {currentYear}
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={nextMonth}>Next &rarr;</Button>
        </div>
        <select
          className="h-9 rounded-xl border border-input bg-background px-3 text-sm"
          value={selectedStaff}
          onChange={(e) => setSelectedStaff(e.target.value)}
        >
          <option value="all">All Staff</option>
          {activeStaff.map((s) => (
            <option key={s.id} value={s.id}>{s.fullName}</option>
          ))}
        </select>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700/50">
                <th className="sticky left-0 bg-white dark:bg-gray-900 z-10 text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase min-w-[140px]">Staff</th>
                {days.map((day) => {
                  const date = new Date(currentYear, currentMonth - 1, day)
                  const isSunday = date.getDay() === 0
                  return (
                    <th
                      key={day}
                      className={`px-1.5 py-3 text-center text-xs font-medium ${
                        isSunday ? 'text-red-400' : 'text-gray-500'
                      }`}
                    >
                      {day}
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {filteredStaff.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="sticky left-0 bg-white dark:bg-gray-900 z-10 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center">
                        <span className="text-accent text-xs font-bold">
                          {s.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white text-sm truncate max-w-[120px]">
                        {s.fullName}
                      </span>
                    </div>
                  </td>
                  {days.map((day) => {
                    const att = getAttendance(s.id, day)
                    const date = new Date(currentYear, currentMonth - 1, day)
                    const isSunday = date.getDay() === 0
                    return (
                      <td
                        key={day}
                        className={`px-1.5 py-2 text-center cursor-pointer transition-colors ${
                          isSunday ? 'bg-gray-50 dark:bg-gray-800/30' : ''
                        }`}
                        onClick={() => !isSunday && toggleStatus(s.id, day)}
                        title={isSunday ? 'Sunday' : att ? `${att.status} - Click to change` : 'Click to mark'}
                      >
                        {isSunday ? (
                          <span className="text-gray-300 dark:text-gray-600 text-xs">-</span>
                        ) : att ? (
                          <div className="flex flex-col items-center gap-0.5">
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${statusColors[att.status].split(' ')[0]} bg-opacity-20`}>
                              {att.status === 'present' ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                              ) : att.status === 'absent' ? (
                                <XCircle className="w-3.5 h-3.5 text-red-600" />
                              ) : (
                                <Clock className="w-3.5 h-3.5 text-yellow-600" />
                              )}
                            </div>
                            <span className={`text-[10px] font-medium ${
                              att.status === 'present' ? 'text-green-600' :
                              att.status === 'absent' ? 'text-red-600' : 'text-yellow-600'
                            }`}>
                              {att.status === 'present' ? 'P' : att.status === 'absent' ? 'A' : 'L'}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-300 dark:text-gray-600">-</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Present</span>
              </div>
              <span className="text-lg font-bold text-green-600">
                {totals.reduce((sum, t) => sum + t.present, 0)}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Absent</span>
              </div>
              <span className="text-lg font-bold text-red-600">
                {totals.reduce((sum, t) => sum + t.absent, 0)}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Leaves</span>
              </div>
              <span className="text-lg font-bold text-yellow-600">
                {totals.reduce((sum, t) => sum + t.leave, 0)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
