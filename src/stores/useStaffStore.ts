import { create } from 'zustand'
import { Staff, StaffFormData, Attendance, SalaryRecord, Payroll } from '@/types'
import { generateStaffId } from '@/lib/utils'
import * as db from '@/lib/db-api'

function toStaffResponse(staff: any): Staff {
  return {
    ...staff,
    joiningDate: typeof staff.joiningDate === 'string' ? staff.joiningDate : staff.joiningDate.toISOString().split('T')[0],
  }
}

function toAttendanceRecord(a: any): Attendance {
  return {
    ...a,
    date: typeof a.date === 'string' ? a.date : a.date.toISOString().split('T')[0],
  }
}

interface StaffStore {
  staff: Staff[]
  attendance: Attendance[]
  salaries: SalaryRecord[]
  payrolls: Payroll[]
  currentUser: Staff | null
  loading: boolean
  loaded: boolean

  init: () => Promise<void>
  addStaff: (data: StaffFormData) => Promise<void>
  updateStaff: (id: string, data: Partial<Staff>) => Promise<void>
  removeStaff: (id: string) => Promise<void>
  markAttendance: (record: Attendance) => Promise<void>
  updateAttendance: (id: string, data: Partial<Attendance>) => Promise<void>
  loadAttendance: (staffId: string, month: number, year: number) => Promise<Attendance[]>
  getAttendanceByStaff: (staffId: string, month: number, year: number) => Attendance[]
  addSalaryRecord: (record: SalaryRecord) => Promise<void>
  updateSalaryRecord: (id: string, data: Partial<SalaryRecord>) => Promise<void>
  markSalaryPaid: (id: string) => Promise<void>
  generatePayroll: (month: number, year: number) => Promise<void>
  updatePayrollStatus: (id: string, status: 'pending' | 'paid' | 'cancelled') => Promise<void>
  setCurrentUser: (user: Staff | null) => void
}

export const useStaffStore = create<StaffStore>((set, get) => ({
  staff: [],
  attendance: [],
  salaries: [],
  payrolls: [],
  currentUser: null,
  loading: true,
  loaded: false,

  init: async () => {
    if (get().loaded) return
    const [staffList, salaries, payrolls] = await Promise.all([
      db.staffGetAll(),
      db.salaryGetAll(),
      db.payrollGetAll(),
    ])
    set({
      staff: staffList.map(toStaffResponse),
      salaries: salaries as SalaryRecord[],
      payrolls: payrolls as Payroll[],
      loading: false,
      loaded: true,
    })
  },

  addStaff: async (data) => {
    const activeStaff = get().staff.filter((s) => s.isActive)
    const nextIndex = activeStaff.length + 10
    const staffId = generateStaffId(nextIndex)
    const created = await db.staffCreate({
      ...data,
      staffId,
      isActive: true,
      role: data.isAdmin ? 'admin' : data.role || 'staff',
      joiningDate: new Date(data.joiningDate),
    })
    set((state) => ({
      staff: [...state.staff, toStaffResponse(created)],
    }))
  },

  updateStaff: async (id, data) => {
    const updateData: any = { ...data }
    if (data.joiningDate) updateData.joiningDate = new Date(data.joiningDate)
    const updated = await db.staffUpdate(id, updateData)
    set((state) => ({
      staff: state.staff.map((s) => (s.id === id ? toStaffResponse(updated) : s)),
    }))
  },

  removeStaff: async (id) => {
    await db.staffDelete(id)
    set((state) => ({
      staff: state.staff.map((s) => (s.id === id ? { ...s, isActive: false } : s)),
    }))
  },

  markAttendance: async (record) => {
    const { staffId, date, status, checkIn, checkOut, hoursWorked, notes } = record
    await db.attendanceUpsert({ staffId, date: new Date(date), status, checkIn, checkOut, hoursWorked, notes })
    set((state) => {
      const existing = state.attendance.find(
        (a) => a.staffId === record.staffId && a.date === record.date
      )
      if (existing) {
        return {
          attendance: state.attendance.map((a) =>
            a.id === existing.id ? { ...a, ...record } : a
          ),
        }
      }
      return { attendance: [...state.attendance, record] }
    })
  },

  updateAttendance: async (id, data) => {
    const record = get().attendance.find((a) => a.id === id)
    if (record) {
      await db.attendanceUpsert({ ...record, ...data, date: new Date(record.date) })
    }
    set((state) => ({
      attendance: state.attendance.map((a) => (a.id === id ? { ...a, ...data } : a)),
    }))
  },

  loadAttendance: async (staffId: string, month: number, year: number) => {
    const records = await db.attendanceGetByStaff(staffId, month, year)
    const mapped = records.map(toAttendanceRecord)
    set((state) => ({
      attendance: [...state.attendance.filter((a) => a.staffId !== staffId), ...mapped],
    }))
    return mapped
  },

  getAttendanceByStaff: (staffId, month, year) => {
    return get().attendance.filter((a) => {
      const d = new Date(a.date)
      return a.staffId === staffId && d.getMonth() === month - 1 && d.getFullYear() === year
    })
  },

  addSalaryRecord: async (record) => {
    const created = await db.salaryCreate(record)
    set((state) => ({ salaries: [...state.salaries, created as SalaryRecord] }))
  },

  updateSalaryRecord: async (id, data) => {
    const updated = await db.salaryUpdate(id, data)
    set((state) => ({
      salaries: state.salaries.map((s) => (s.id === id ? { ...s, ...updated } : s)),
    }))
  },

  markSalaryPaid: async (id) => {
    await db.salaryMarkPaid(id)
    set((state) => ({
      salaries: state.salaries.map((s) =>
        s.id === id ? { ...s, paid: true, paidDate: new Date().toISOString() } : s
      ),
    }))
  },

  generatePayroll: async (month, year) => {
    const { salaries } = get()
    const monthSalaries = salaries.filter((s) => s.month === month && s.year === year && !s.paid)
    const total = monthSalaries.reduce((sum, s) => sum + s.totalSalary, 0)
    const payroll = await db.payrollCreate({
      staffId: 'payroll',
      month,
      year,
      generatedDate: new Date(),
      totalSalaries: total,
      status: 'pending',
    })
    for (const s of monthSalaries) {
      await db.salaryMarkPaid(s.id)
    }
    set((state) => ({
      payrolls: [...state.payrolls, payroll as Payroll],
      salaries: state.salaries.map((s) =>
        s.month === month && s.year === year && !s.paid
          ? { ...s, paid: true, paidDate: new Date().toISOString() }
          : s
      ),
    }))
  },

  updatePayrollStatus: async (id, status) => {
    await db.payrollUpdate(id, { status })
    set((state) => ({
      payrolls: state.payrolls.map((p) => (p.id === id ? { ...p, status } : p)),
    }))
  },

  setCurrentUser: (user) => set({ currentUser: user }),
}))
