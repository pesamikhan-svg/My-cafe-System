import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useStaffStore } from '@/stores/useStaffStore'
import { formatCurrency, formatDate, getMonthName, printElement } from '@/lib/utils'
import { Printer, X } from 'lucide-react'

interface SalarySlipProps {
  salaryId: string
  onClose: () => void
}

export default function SalarySlip({ salaryId, onClose }: SalarySlipProps) {
  const { salaries, staff } = useStaffStore()
  const slipRef = useRef<HTMLDivElement>(null)

  const record = salaries.find((s) => s.id === salaryId)
  if (!record) return null

  const member = staff.find((s) => s.id === record.staffId)
  if (!member) return null

  const handlePrint = () => {
    printElement('salary-slip-content')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700/50">
          <h2 className="text-lg font-semibold">Salary Slip</h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-1" /> Print
            </Button>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-5" id="salary-slip-content" ref={slipRef}>
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Premium Cafe</h1>
            <p className="text-sm text-gray-500">Salary Slip</p>
            <p className="text-sm text-gray-500">{getMonthName(record.month)} {record.year}</p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <div>
                <p className="text-xs text-gray-500">Employee Name</p>
                <p className="text-sm font-semibold">{member.fullName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Staff ID</p>
                <p className="text-sm font-semibold">{member.staffId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Position</p>
                <p className="text-sm font-semibold">{member.position}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Joining Date</p>
                <p className="text-sm font-semibold">{formatDate(member.joiningDate)}</p>
              </div>
            </div>

            <div className="border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50">
                    <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Description</th>
                    <th className="text-right px-4 py-2 text-xs font-medium text-gray-500">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="px-4 py-2.5">Basic Salary</td>
                    <td className="px-4 py-2.5 text-right">{formatCurrency(record.basicSalary)}</td>
                  </tr>
                  {record.overtimePay > 0 && (
                    <tr>
                      <td className="px-4 py-2.5">Overtime ({record.overtimeHours} hrs x {formatCurrency(record.overtimeRate)}/hr)</td>
                      <td className="px-4 py-2.5 text-right">{formatCurrency(record.overtimePay)}</td>
                    </tr>
                  )}
                  {record.bonuses > 0 && (
                    <tr>
                      <td className="px-4 py-2.5">Bonuses</td>
                      <td className="px-4 py-2.5 text-right text-green-600">+{formatCurrency(record.bonuses)}</td>
                    </tr>
                  )}
                  <tr>
                    <td className="px-4 py-2.5">Allowances</td>
                    <td className="px-4 py-2.5 text-right">{formatCurrency(record.allowances)}</td>
                  </tr>
                  {record.deductions > 0 && (
                    <tr>
                      <td className="px-4 py-2.5">Deductions</td>
                      <td className="px-4 py-2.5 text-right text-red-600">-{formatCurrency(record.deductions)}</td>
                    </tr>
                  )}
                  {record.advanceDeduction > 0 && (
                    <tr>
                      <td className="px-4 py-2.5">Advance/Loan Deduction</td>
                      <td className="px-4 py-2.5 text-right text-red-600">-{formatCurrency(record.advanceDeduction)}</td>
                    </tr>
                  )}
                  {record.latePenalties > 0 && (
                    <tr>
                      <td className="px-4 py-2.5">Late Arrival Penalties</td>
                      <td className="px-4 py-2.5 text-right text-red-600">-{formatCurrency(record.latePenalties)}</td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="bg-accent/5">
                    <td className="px-4 py-3 font-bold text-base">Net Salary</td>
                    <td className="px-4 py-3 text-right font-bold text-lg text-accent">{formatCurrency(record.totalSalary)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="flex justify-between items-center">
              <Badge variant={record.paid ? 'success' : 'warning'} className="text-xs">
                {record.paid ? 'Paid' : 'Pending'}
              </Badge>
              {record.paidDate && (
                <span className="text-xs text-gray-500">Paid on: {formatDate(record.paidDate)}</span>
              )}
            </div>

            <div className="text-center text-xs text-gray-400 pt-4 border-t">
              This is a computer-generated salary slip.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
