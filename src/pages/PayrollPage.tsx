import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useStaffStore } from '@/stores/useStaffStore'
import { formatCurrency, getMonthName, exportToCSV, printElement } from '@/lib/utils'
import {
  DollarSign,
  Download,
  Printer,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Plus,
} from 'lucide-react'

export default function PayrollPage() {
  const today = new Date()
  const { payrolls, staff, salaries, generatePayroll, updatePayrollStatus } = useStaffStore()
  const currentMonth = today.getMonth() + 1
  const currentYear = today.getFullYear()

  const sortedPayrolls = [...payrolls].sort((a, b) => {
    const dateA = new Date(a.generatedDate)
    const dateB = new Date(b.generatedDate)
    return dateB.getTime() - dateA.getTime()
  })

  const totalPendingPayroll = payrolls
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + p.totalSalaries, 0)

  const totalPaidPayroll = payrolls
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + p.totalSalaries, 0)

  const unpaidSalaries = salaries.filter(
    (s) => s.month === currentMonth && s.year === currentYear && !s.paid
  )

  const handleGeneratePayroll = () => {
    generatePayroll(currentMonth, currentYear)
  }

  const payrollData = sortedPayrolls.map((p) => {
    const monthStaff = staff.filter((s) => {
      const memberSalary = salaries.find(
        (sal) => sal.staffId === s.id && sal.month === p.month && sal.year === p.year
      )
      return memberSalary && s.isActive
    })
    return {
      ...p,
      staffCount: monthStaff.length,
    }
  })

  const exportCSV = () => {
    const data = sortedPayrolls.map((p) => ({
      Month: getMonthName(p.month),
      Year: p.year,
      'Generated Date': new Date(p.generatedDate).toLocaleDateString(),
      'Total Salaries': p.totalSalaries,
      Status: p.status,
    }))
    exportToCSV(data, 'payroll-history')
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payroll Management</h1>
          <p className="text-sm text-gray-500 mt-1">Generate monthly payroll and manage salary payments</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={exportCSV}>
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
          <Button onClick={handleGeneratePayroll} disabled={unpaidSalaries.length === 0}>
            <Plus className="w-4 h-4 mr-2" /> Generate Payroll
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-accent/5"><DollarSign className="w-5 h-5 text-accent" /></div>
              <div>
                <p className="text-sm text-gray-500">Total Payroll</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(sortedPayrolls.reduce((sum, p) => sum + p.totalSalaries, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-green-50 dark:bg-green-500/10"><CheckCircle2 className="w-5 h-5 text-green-600" /></div>
              <div>
                <p className="text-sm text-gray-500">Paid</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalPaidPayroll)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-yellow-50 dark:bg-yellow-500/10"><Clock className="w-5 h-5 text-yellow-600" /></div>
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{formatCurrency(totalPendingPayroll)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {unpaidSalaries.length > 0 && (
        <Card className="border-yellow-200 dark:border-yellow-800">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <span className="text-sm text-yellow-800 dark:text-yellow-200">
              {unpaidSalaries.length} unpaid salary record(s) for {getMonthName(currentMonth)} {currentYear}. Generate payroll to process them.
            </span>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Payroll History</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700/50">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Period</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Generated Date</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">Total Amount</th>
                <th className="text-center px-5 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {payrollData.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {getMonthName(p.month)} {p.year}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">
                    {new Date(p.generatedDate).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 text-sm font-bold text-right">{formatCurrency(p.totalSalaries)}</td>
                  <td className="px-5 py-4 text-center">
                    <Badge
                      variant={p.status === 'paid' ? 'success' : p.status === 'pending' ? 'warning' : 'destructive'}
                      className="text-xs capitalize"
                    >
                      {p.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {p.status === 'pending' && (
                        <Button variant="ghost" size="sm" className="h-8 text-xs text-green-600"
                          onClick={() => updatePayrollStatus(p.id, 'paid')}>
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Mark Paid
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="h-8 text-xs"
                        onClick={() => printElement(`payroll-${p.id}`)}>
                        <Printer className="w-3.5 h-3.5 mr-1" /> Print
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {payrollData.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-gray-500">
                    No payroll records found. Generate your first payroll.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div id="payroll-report" className="hidden">
        {payrollData.map((p) => (
          <div key={p.id} id={`payroll-${p.id}`} className="p-8 bg-white">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold">Premium Cafe</h2>
              <p className="text-gray-500">Payroll Report</p>
              <p className="text-gray-500">{getMonthName(p.month)} {p.year}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Staff</th>
                  <th className="text-right">Basic Salary</th>
                  <th className="text-right">Overtime</th>
                  <th className="text-right">Bonuses</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {salaries.filter(s => s.month === p.month && s.year === p.year).map((s) => {
                  const member = staff.find((m) => m.id === s.staffId)
                  return (
                    <tr key={s.id}>
                      <td>{member?.fullName}</td>
                      <td className="text-right">${s.basicSalary.toFixed(2)}</td>
                      <td className="text-right">${s.overtimePay.toFixed(2)}</td>
                      <td className="text-right">${s.bonuses.toFixed(2)}</td>
                      <td className="text-right font-bold">${s.totalSalary.toFixed(2)}</td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4} className="text-right font-bold">Total:</td>
                  <td className="text-right font-bold">${p.totalSalaries.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
            <div className="mt-8 text-sm text-gray-500 text-center">
              Generated on {new Date(p.generatedDate).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
