import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useStaffStore } from '@/stores/useStaffStore'
import { formatCurrency, getMonthName, calculateSalary, exportToCSV } from '@/lib/utils'
import { SalaryRecord } from '@/types'
import {
  DollarSign,
  Download,
  CheckCircle2,
  Clock,
  Calculator,
  X,
} from 'lucide-react'
import SalarySlip from '@/components/staff/SalarySlip'

export default function SalaryPage() {
  const today = new Date()
  const { staff, salaries, addSalaryRecord, updateSalaryRecord, markSalaryPaid } = useStaffStore()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1)
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedStaff, setSelectedStaff] = useState('all')
  const [showCalculator, setShowCalculator] = useState(false)
  const [calcStaffId, setCalcStaffId] = useState('')
  const [showSlip, setShowSlip] = useState<string | null>(null)

  const activeStaff = staff.filter((s) => s.isActive)

  const [calcForm, setCalcForm] = useState({
    overtimeHours: 0,
    overtimeRate: 0,
    bonuses: 0,
    allowances: 200,
    deductions: 0,
    advanceDeduction: 0,
    latePenalties: 0,
  })

  const filteredSalaries = salaries.filter((s) => {
    const matchMonth = s.month === currentMonth && s.year === currentYear
    const matchStaff = selectedStaff === 'all' || s.staffId === selectedStaff
    return matchMonth && matchStaff
  })

  const totalPending = filteredSalaries.filter((s) => !s.paid).reduce((sum, s) => sum + s.totalSalary, 0)
  const totalPaid = filteredSalaries.filter((s) => s.paid).reduce((sum, s) => sum + s.totalSalary, 0)

  const prevMonth = () => {
    if (currentMonth === 1) { setCurrentMonth(12); setCurrentYear((y) => y - 1) }
    else { setCurrentMonth((m) => m - 1) }
  }
  const nextMonth = () => {
    if (currentMonth === 12) { setCurrentMonth(1); setCurrentYear((y) => y + 1) }
    else { setCurrentMonth((m) => m + 1) }
  }

  const openCalculator = (staffId: string) => {
    const existing = salaries.find((s) => s.staffId === staffId && s.month === currentMonth && s.year === currentYear)
    const member = staff.find((s) => s.id === staffId)
    setCalcStaffId(staffId)
    setCalcForm({
      overtimeHours: existing?.overtimeHours || 0,
      overtimeRate: existing?.overtimeRate || (member ? member.basicSalary / 200 : 0),
      bonuses: existing?.bonuses || 0,
      allowances: existing?.allowances || 200,
      deductions: existing?.deductions || 0,
      advanceDeduction: existing?.advanceDeduction || 0,
      latePenalties: existing?.latePenalties || 0,
    })
    setShowCalculator(true)
  }

  const handleCalculate = () => {
    const member = staff.find((s) => s.id === calcStaffId)
    if (!member) return

    const total = calculateSalary({
      basicSalary: member.basicSalary,
      ...calcForm,
    })

    const existing = salaries.find(
      (s) => s.staffId === calcStaffId && s.month === currentMonth && s.year === currentYear
    )

    const record: SalaryRecord = {
      id: existing?.id || `sal-${calcStaffId}-${currentMonth}`,
      staffId: calcStaffId,
      month: currentMonth,
      year: currentYear,
      basicSalary: member.basicSalary,
      overtimeHours: calcForm.overtimeHours,
      overtimeRate: Math.round(calcForm.overtimeRate * 100) / 100,
      overtimePay: Math.round(calcForm.overtimeHours * calcForm.overtimeRate * 100) / 100,
      bonuses: calcForm.bonuses,
      allowances: calcForm.allowances,
      deductions: calcForm.deductions,
      advanceDeduction: calcForm.advanceDeduction,
      latePenalties: calcForm.latePenalties,
      totalSalary: total,
      paid: existing?.paid || false,
    }

    if (existing) {
      updateSalaryRecord(existing.id, record)
    } else {
      addSalaryRecord(record)
    }
    setShowCalculator(false)
  }

  const calcTotal = calcStaffId
    ? calculateSalary({
        basicSalary: staff.find((s) => s.id === calcStaffId)?.basicSalary || 0,
        ...calcForm,
      })
    : 0

  const exportCSV = () => {
    const data = filteredSalaries.map((s) => {
      const member = staff.find((m) => m.id === s.staffId)
      return {
        'Staff ID': member?.staffId || '',
        Name: member?.fullName || '',
        Month: getMonthName(s.month),
        Year: s.year,
        'Basic Salary': s.basicSalary,
        'Overtime Hours': s.overtimeHours,
        'Overtime Pay': s.overtimePay,
        Bonuses: s.bonuses,
        Allowances: s.allowances,
        Deductions: s.deductions,
        'Late Penalties': s.latePenalties,
        'Total Salary': s.totalSalary,
        Status: s.paid ? 'Paid' : 'Pending',
      }
    })
    exportToCSV(data, `salary-${currentMonth}-${currentYear}`)
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Salary Management</h1>
          <p className="text-sm text-gray-500 mt-1">Calculate and manage staff salaries</p>
        </div>
        <Button variant="outline" onClick={exportCSV}>
          <Download className="w-4 h-4 mr-2" /> Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-accent/5"><DollarSign className="w-5 h-5 text-accent" /></div>
                <div><p className="text-sm text-gray-500">Total Salary</p><p className="text-xl font-bold">{formatCurrency(totalPending + totalPaid)}</p></div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-yellow-50 dark:bg-yellow-500/10"><Clock className="w-5 h-5 text-yellow-600" /></div>
                <div><p className="text-sm text-gray-500">Pending</p><p className="text-xl font-bold text-yellow-600">{formatCurrency(totalPending)}</p></div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-green-50 dark:bg-green-500/10"><CheckCircle2 className="w-5 h-5 text-green-600" /></div>
                <div><p className="text-sm text-gray-500">Paid</p><p className="text-xl font-bold text-green-600">{formatCurrency(totalPaid)}</p></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={prevMonth}>&larr;</Button>
          <span className="text-lg font-semibold text-gray-900 dark:text-white">{getMonthName(currentMonth)} {currentYear}</span>
          <Button variant="outline" size="sm" onClick={nextMonth}>&rarr;</Button>
        </div>
        <select
          className="h-9 rounded-xl border bg-background px-3 text-sm"
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
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700/50">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Staff</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">Basic</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">Overtime</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">Bonuses</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">Allow.</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">Deduct.</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">Penalties</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="text-center px-5 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {filteredSalaries.map((s) => {
                const member = staff.find((m) => m.id === s.staffId)
                return (
                  <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center">
                          <span className="text-accent text-xs font-bold">{member?.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}</span>
                        </div>
                        <span className="text-sm font-medium">{member?.fullName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-right">{formatCurrency(s.basicSalary)}</td>
                    <td className="px-5 py-4 text-sm text-right">{s.overtimeHours > 0 ? formatCurrency(s.overtimePay) : '-'}</td>
                    <td className="px-5 py-4 text-sm text-right text-green-600">{s.bonuses > 0 ? formatCurrency(s.bonuses) : '-'}</td>
                    <td className="px-5 py-4 text-sm text-right">{formatCurrency(s.allowances)}</td>
                    <td className="px-5 py-4 text-sm text-right text-red-600">{s.deductions > 0 ? `-${formatCurrency(s.deductions)}` : '-'}</td>
                    <td className="px-5 py-4 text-sm text-right text-red-600">{s.latePenalties > 0 ? `-${formatCurrency(s.latePenalties)}` : '-'}</td>
                    <td className="px-5 py-4 text-sm font-bold text-right text-accent">{formatCurrency(s.totalSalary)}</td>
                    <td className="px-5 py-4 text-center">
                      <Badge variant={s.paid ? 'success' : 'warning'} className="text-xs">{s.paid ? 'Paid' : 'Pending'}</Badge>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => openCalculator(s.staffId)}>
                          <Calculator className="w-3.5 h-3.5 mr-1" /> Edit
                        </Button>
                        {!s.paid && (
                          <Button variant="ghost" size="sm" className="h-8 text-xs text-green-600" onClick={() => markSalaryPaid(s.id)}>
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Pay
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => setShowSlip(s.id)}>
                          Slip
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filteredSalaries.length === 0 && activeStaff.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center">
                        <span className="text-accent text-xs font-bold">{member.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}</span>
                      </div>
                      <span className="text-sm font-medium">{member.fullName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-right">{formatCurrency(member.basicSalary)}</td>
                  <td className="px-5 py-4 text-sm text-right text-gray-400">-</td>
                  <td className="px-5 py-4 text-sm text-right text-gray-400">-</td>
                  <td className="px-5 py-4 text-sm text-right">-</td>
                  <td className="px-5 py-4 text-sm text-right text-gray-400">-</td>
                  <td className="px-5 py-4 text-sm text-right text-gray-400">-</td>
                  <td className="px-5 py-4 text-sm font-bold text-right text-gray-400">-</td>
                  <td className="px-5 py-4 text-center">
                    <Badge variant="outline" className="text-xs">Not Set</Badge>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => openCalculator(member.id)}>
                      <Calculator className="w-3.5 h-3.5 mr-1" /> Calculate
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {showCalculator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calculator className="w-5 h-5 text-accent" />
                Salary Calculator - {staff.find(s => s.id === calcStaffId)?.fullName}
              </h3>
              <button onClick={() => setShowCalculator(false)}><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Basic Salary: <strong>{formatCurrency(staff.find(s => s.id === calcStaffId)?.basicSalary || 0)}</strong>
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Overtime Hours</label>
                  <input type="number" min="0" className="flex h-9 w-full rounded-xl border bg-background px-3 text-sm" value={calcForm.overtimeHours} onChange={(e) => setCalcForm({ ...calcForm, overtimeHours: parseFloat(e.target.value) || 0 })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Overtime Rate/hr</label>
                  <input type="number" min="0" step="0.01" className="flex h-9 w-full rounded-xl border bg-background px-3 text-sm" value={calcForm.overtimeRate} onChange={(e) => setCalcForm({ ...calcForm, overtimeRate: parseFloat(e.target.value) || 0 })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Bonuses</label>
                  <input type="number" min="0" className="flex h-9 w-full rounded-xl border bg-background px-3 text-sm" value={calcForm.bonuses} onChange={(e) => setCalcForm({ ...calcForm, bonuses: parseFloat(e.target.value) || 0 })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Allowances</label>
                  <input type="number" min="0" className="flex h-9 w-full rounded-xl border bg-background px-3 text-sm" value={calcForm.allowances} onChange={(e) => setCalcForm({ ...calcForm, allowances: parseFloat(e.target.value) || 0 })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Deductions</label>
                  <input type="number" min="0" className="flex h-9 w-full rounded-xl border bg-background px-3 text-sm" value={calcForm.deductions} onChange={(e) => setCalcForm({ ...calcForm, deductions: parseFloat(e.target.value) || 0 })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Advance Deduction</label>
                  <input type="number" min="0" className="flex h-9 w-full rounded-xl border bg-background px-3 text-sm" value={calcForm.advanceDeduction} onChange={(e) => setCalcForm({ ...calcForm, advanceDeduction: parseFloat(e.target.value) || 0 })} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Late Arrival Penalties</label>
                  <input type="number" min="0" className="flex h-9 w-full rounded-xl border bg-background px-3 text-sm" value={calcForm.latePenalties} onChange={(e) => setCalcForm({ ...calcForm, latePenalties: parseFloat(e.target.value) || 0 })} />
                </div>
              </div>
              <div className="border-t pt-3 flex items-center justify-between">
                <span className="font-semibold">Total Salary:</span>
                <span className="text-xl font-bold text-accent">{formatCurrency(calcTotal)}</span>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowCalculator(false)}>Cancel</Button>
                <Button onClick={handleCalculate}>Save Salary</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSlip && (
        <SalarySlip
          salaryId={showSlip}
          onClose={() => setShowSlip(null)}
        />
      )}
    </div>
  )
}
