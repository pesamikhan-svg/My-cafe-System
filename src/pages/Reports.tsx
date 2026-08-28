import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BarChart3, Download, FileSpreadsheet, TrendingUp, DollarSign, ShoppingBag, PieChart } from 'lucide-react'
import { useProfitStore } from '@/stores/useProfitStore'
import { formatCurrency, exportToCSV } from '@/lib/utils'

export default function ReportsPage() {
  const { loading, init, getMonthlySummary, getYearlySummary, getRevenueBySource, getExpensesByCategory, getTopCOGS } = useProfitStore()

  useEffect(() => { init() }, [init])

  const monthly = getMonthlySummary()
  const yearly = getYearlySummary()
  const revenueBySource = getRevenueBySource()
  const expensesByCategory = getExpensesByCategory()
  const topCOGS = getTopCOGS(5)

  const reports = [
    { label: 'Monthly Revenue', value: formatCurrency(monthly.totalRevenue), change: '+12.5%', up: true },
    { label: 'Monthly Profit', value: formatCurrency(monthly.netProfit), change: monthly.profitMargin + '%', up: monthly.netProfit > 0 },
    { label: 'Total Expenses', value: formatCurrency(monthly.totalExpenses + monthly.totalSalaries), change: '', up: false },
    { label: 'Yearly Revenue', value: formatCurrency(yearly.totalRevenue), change: '+15.2%', up: true },
  ]

  if (loading) {
    return (
      <div className="flex-1 min-h-0 overflow-y-auto p-6 animate-fade-in">
        <div className="flex items-center justify-center h-full text-gray-400">Loading reports...</div>
      </div>
    )
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Comprehensive sales and performance reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => exportToCSV([{ ...monthly, period: 'Monthly' }, { ...yearly, period: 'Yearly' }], 'reports')}>
            <FileSpreadsheet className="w-4 h-4" />
            Export Excel
          </Button>
          <Button className="gap-2" onClick={() => exportToCSV([...revenueBySource.map(r => ({ ...r, type: 'Revenue' })), ...expensesByCategory.map(e => ({ ...e, type: 'Expense' })), ...topCOGS.map(c => ({ ...c, type: 'COGS' }))], 'all_reports')}>
            <Download className="w-4 h-4" />
            Download All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reports.map((report) => (
          <Card key={report.label} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <p className="text-sm text-gray-500">{report.label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{report.value}</p>
              {report.change && (
                <Badge variant={report.up ? 'success' : 'destructive'} className="mt-2">
                  {report.change}
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Revenue by Source</CardTitle>
            <BarChart3 className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {revenueBySource.map((item) => {
                const max = Math.max(...revenueBySource.map((r) => r.amount))
                const pct = max > 0 ? (item.amount / max) * 100 : 0
                return (
                  <div key={item.source}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">{item.source}</span>
                      <span className="font-medium">{formatCurrency(item.amount)}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Expenses by Category</CardTitle>
            <PieChart className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expensesByCategory.map((item) => {
                const max = Math.max(...expensesByCategory.map((r) => r.amount))
                const pct = max > 0 ? (item.amount / max) * 100 : 0
                return (
                  <div key={item.category}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400 capitalize">{item.category}</span>
                      <span className="font-medium">{formatCurrency(item.amount)}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Top COGS</CardTitle>
            <ShoppingBag className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topCOGS.map((item) => {
                const max = Math.max(...topCOGS.map((r) => r.total))
                const pct = max > 0 ? (item.total / max) * 100 : 0
                return (
                  <div key={item.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                      <span className="font-medium">{formatCurrency(item.total)}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Monthly Summary</CardTitle>
            <TrendingUp className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Gross Profit</span>
                <span className="font-bold text-lg">{formatCurrency(monthly.grossProfit)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Total Expenses</span>
                <span className="font-bold text-lg text-red-500">{formatCurrency(monthly.totalExpenses + monthly.totalSalaries)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Net Profit</span>
                <span className={`font-bold text-lg ${monthly.netProfit >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {formatCurrency(monthly.netProfit)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-700">
                <span className="text-sm text-gray-500">Profit Margin</span>
                <Badge variant={monthly.profitMargin >= 0 ? 'success' : 'destructive'}>
                  {monthly.profitMargin}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
