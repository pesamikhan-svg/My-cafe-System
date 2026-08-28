import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useProfitStore } from '@/stores/useProfitStore'
import { useStaffStore } from '@/stores/useStaffStore'
import { formatCurrency, exportToCSV, printElement } from '@/lib/utils'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Receipt,
  Percent,
  CalendarDays,
  Download,
  Printer,
  RefreshCw,
  Wallet,
  ClipboardList,
  ArrowUp,
  ArrowDown,
  Trash2,
  Tag,
  Plus,
  X,
} from 'lucide-react'

export default function ProfitLoss() {
  const [view, setView] = useState<'dashboard' | 'reports' | 'expenses' | 'revenue'>('dashboard')
  const store = useProfitStore()
  const salaries = useStaffStore((s) => s.salaries)

  const daily = store.getDailySummary()
  const monthly = store.getMonthlySummary()
  const yearly = store.getYearlySummary()
  const monthlyReports = store.getProfitReports('monthly')
  const revenueBySource = store.getRevenueBySource()
  const expensesByCategory = store.getExpensesByCategory()
  const topCOGS = store.getTopCOGS()

  const maxRevenue = Math.max(...monthlyReports.map((r) => r.totalRevenue), 1)
  const maxProfit = Math.max(...monthlyReports.map((r) => r.netProfit), 1)
  const maxExpense = Math.max(...expensesByCategory.map((e) => e.amount), 1)

  const [showAddRevenue, setShowAddRevenue] = useState(false)
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [showAddCOGS, setShowAddCOGS] = useState(false)
  const [showNewExpCat, setShowNewExpCat] = useState(false)
  const [newExpCatName, setNewExpCatName] = useState('')

  const [revForm, setRevForm] = useState({ date: new Date().toISOString().split('T')[0], amount: 0, source: 'Dine-in' })
  const [expForm, setExpForm] = useState({ date: new Date().toISOString().split('T')[0], amount: 0, category: 'Supplies', description: '' })
  const [cogsForm, setCogsForm] = useState({ date: new Date().toISOString().split('T')[0], productName: '', quantity: 1, unit: 'kg', unitCost: 0 })

  const exportReport = () => {
    const data = monthlyReports.map((r) => ({
      Period: r.label,
      Revenue: r.totalRevenue,
      COGS: r.totalCOGS,
      'Gross Profit': r.grossProfit,
      Salaries: r.totalSalaries,
      Expenses: r.totalExpenses,
      Discounts: r.totalDiscounts,
      'Net Profit': r.netProfit,
      'Margin %': r.profitMargin,
    }))
    exportToCSV(data, 'profit-loss-report')
  }

  const handleAddRevenue = () => {
    store.addRevenue({
      date: revForm.date,
      amount: revForm.amount,
      source: revForm.source,
    })
    setShowAddRevenue(false)
    setRevForm({ date: new Date().toISOString().split('T')[0], amount: 0, source: 'Dine-in' })
  }

  const handleAddExpense = async () => {
    let cat = expForm.category
    if (cat && !store.expenseCategories.find((c) => c.name === cat)) {
      await store.addExpenseCategory({ name: cat, icon: 'tag', budget: 0 })
    }
    store.addExpense({
      date: expForm.date,
      amount: expForm.amount,
      category: cat,
      description: expForm.description,
    })
    setShowAddExpense(false)
    setExpForm({ date: new Date().toISOString().split('T')[0], amount: 0, category: 'Supplies', description: '' })
  }

  const handleAddCOGS = () => {
    store.addCOGS({
      date: cogsForm.date,
      productName: cogsForm.productName,
      quantity: cogsForm.quantity,
      unit: cogsForm.unit,
      unitCost: cogsForm.unitCost,
      totalCost: cogsForm.quantity * cogsForm.unitCost,
    })
    setShowAddCOGS(false)
    setCogsForm({ date: new Date().toISOString().split('T')[0], productName: '', quantity: 1, unit: 'kg', unitCost: 0 })
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'reports', label: 'Reports', icon: ClipboardList },
    { id: 'revenue', label: 'Revenue', icon: DollarSign },
    { id: 'expenses', label: 'Expenses', icon: Wallet },
  ] as const

  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profit & Loss</h1>
          <p className="text-sm text-gray-500 mt-1">Track revenue, expenses, and profitability</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportReport}><Download className="w-4 h-4 mr-2" /> Export</Button>
          {view === 'reports' && <Button variant="outline" onClick={() => printElement('pnl-report')}><Printer className="w-4 h-4 mr-2" /> Print</Button>}
        </div>
      </div>

      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit">
        {tabs.map((t) => {
          const Icon = t.icon
          return (
            <button
              key={t.id}
              onClick={() => setView(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                view === t.id
                  ? 'bg-white dark:bg-gray-700 text-accent shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" /> {t.label}
            </button>
          )
        })}
      </div>

      {view === 'dashboard' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Today's Profit</p>
                    <p className={`text-2xl font-bold ${daily.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(daily.netProfit)}
                    </p>
                    <div className="flex items-center gap-1 text-xs">
                      {daily.profitMargin >= 0 ? <ArrowUp className="w-3 h-3 text-green-500" /> : <ArrowDown className="w-3 h-3 text-red-500" />}
                      <span className={daily.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}>{daily.profitMargin}%</span>
                      <span className="text-gray-400">margin</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-green-50 dark:bg-green-500/10">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Monthly Profit</p>
                    <p className={`text-2xl font-bold ${monthly.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(monthly.netProfit)}
                    </p>
                    <p className="text-xs text-gray-400">{monthly.profitMargin}% margin</p>
                  </div>
                  <div className="p-3 rounded-xl bg-accent/5">
                    <CalendarDays className="w-5 h-5 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(monthly.totalRevenue)}</p>
                    <p className="text-xs text-gray-400">{revenueBySource.length} sources</p>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-500/10">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Total Expenses</p>
                    <p className="text-2xl font-bold text-red-600">{formatCurrency(monthly.totalSalaries + monthly.totalExpenses)}</p>
                    <p className="text-xs text-gray-400">Salaries: {formatCurrency(monthly.totalSalaries)}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10">
                    <ShoppingCart className="w-5 h-5 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Monthly Profit Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {monthlyReports.slice(-6).map((r) => {
                    const revPercent = (r.totalRevenue / maxRevenue) * 100
                    const profitPercent = r.netProfit >= 0 ? (r.netProfit / maxProfit) * 100 : 0
                    const lossPercent = r.netProfit < 0 ? (Math.abs(r.netProfit) / maxProfit) * 100 : 0
                    return (
                      <div key={r.label} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-gray-700 dark:text-gray-300">{r.label}</span>
                          <span className={r.netProfit >= 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                            {formatCurrency(r.netProfit)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-6 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex">
                            <div className="h-full bg-blue-400 transition-all" style={{ width: `${revPercent}%` }} title={`Revenue: ${formatCurrency(r.totalRevenue)}`} />
                            <div className={`h-full transition-all ${r.netProfit >= 0 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${r.netProfit >= 0 ? profitPercent : lossPercent}%` }} />
                          </div>
                          <span className="text-xs text-gray-400 w-16 text-right">{r.profitMargin}%</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Revenue by Source</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {revenueBySource.map((r) => {
                    const pct = (r.amount / monthly.totalRevenue) * 100
                    return (
                      <div key={r.source}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400">{r.source}</span>
                          <span className="font-medium">{formatCurrency(r.amount)}</span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Expenses by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {expensesByCategory.map((e) => {
                    const pct = (e.amount / maxExpense) * 100
                    return (
                      <div key={e.category}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400">{e.category}</span>
                          <span className="font-medium">{formatCurrency(e.amount)}</span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all ${
                            e.category === 'Salaries' ? 'bg-red-400' : 'bg-orange-400'
                          }`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Inventory Cost (COGS)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topCOGS.slice(0, 8).map((item) => {
                    const maxCogs = topCOGS[0]?.total || 1
                    const pct = (item.total / maxCogs) * 100
                    return (
                      <div key={item.name}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                          <span className="font-medium">{formatCurrency(item.total)}</span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {view === 'reports' && (
        <>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Profit & Loss Reports</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={exportReport}>
                    <Download className="w-4 h-4 mr-1" /> CSV
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => printElement('pnl-report')}>
                    <Printer className="w-4 h-4 mr-1" /> Print
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <div id="pnl-report">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-700/50">
                      <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Period</th>
                      <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">Revenue</th>
                      <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">COGS</th>
                      <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">Gross Profit</th>
                      <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">Salaries</th>
                      <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">Expenses</th>
                      <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">Discounts</th>
                      <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">Net Profit</th>
                      <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">Margin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                    {monthlyReports.map((r) => (
                      <tr key={r.label} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-5 py-3.5 text-sm font-medium">{r.label}</td>
                        <td className="px-5 py-3.5 text-sm text-right">{formatCurrency(r.totalRevenue)}</td>
                        <td className="px-5 py-3.5 text-sm text-right text-purple-600">{formatCurrency(r.totalCOGS)}</td>
                        <td className="px-5 py-3.5 text-sm text-right text-blue-600">{formatCurrency(r.grossProfit)}</td>
                        <td className="px-5 py-3.5 text-sm text-right text-red-600">{formatCurrency(r.totalSalaries)}</td>
                        <td className="px-5 py-3.5 text-sm text-right text-orange-600">{formatCurrency(r.totalExpenses)}</td>
                        <td className="px-5 py-3.5 text-sm text-right text-gray-500">{formatCurrency(r.totalDiscounts)}</td>
                        <td className={`px-5 py-3.5 text-sm font-bold text-right ${r.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(r.netProfit)}
                        </td>
                        <td className="px-5 py-3.5 text-sm text-right">
                          <Badge variant={r.profitMargin >= 15 ? 'success' : r.profitMargin >= 0 ? 'warning' : 'destructive'} className="text-xs">
                            {r.profitMargin}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 dark:bg-gray-800/50 font-bold">
                      <td className="px-5 py-3.5 text-sm">Total (Year)</td>
                      <td className="px-5 py-3.5 text-sm text-right">{formatCurrency(monthlyReports.reduce((s, r) => s + r.totalRevenue, 0))}</td>
                      <td className="px-5 py-3.5 text-sm text-right">{formatCurrency(monthlyReports.reduce((s, r) => s + r.totalCOGS, 0))}</td>
                      <td className="px-5 py-3.5 text-sm text-right">{formatCurrency(monthlyReports.reduce((s, r) => s + r.grossProfit, 0))}</td>
                      <td className="px-5 py-3.5 text-sm text-right">{formatCurrency(monthlyReports.reduce((s, r) => s + r.totalSalaries, 0))}</td>
                      <td className="px-5 py-3.5 text-sm text-right">{formatCurrency(monthlyReports.reduce((s, r) => s + r.totalExpenses, 0))}</td>
                      <td className="px-5 py-3.5 text-sm text-right">{formatCurrency(monthlyReports.reduce((s, r) => s + r.totalDiscounts, 0))}</td>
                      <td className="px-5 py-3.5 text-sm text-right text-accent">{formatCurrency(monthlyReports.reduce((s, r) => s + r.netProfit, 0))}</td>
                      <td className="px-5 py-3.5 text-sm text-right">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-blue-600">{formatCurrency(daily.totalRevenue)}</p><p className="text-xs text-gray-500">Today's Revenue</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-purple-600">{formatCurrency(daily.totalCOGS)}</p><p className="text-xs text-gray-500">Today's COGS</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-orange-600">{formatCurrency(daily.totalExpenses)}</p><p className="text-xs text-gray-500">Today's Expenses</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className={`text-2xl font-bold ${daily.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(daily.netProfit)}</p><p className="text-xs text-gray-500">Today's Net Profit</p></CardContent></Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-blue-600">{formatCurrency(monthly.totalRevenue)}</p><p className="text-xs text-gray-500">Monthly Revenue</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-purple-600">{formatCurrency(yearly.totalRevenue)}</p><p className="text-xs text-gray-500">Yearly Revenue</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-green-600">{formatCurrency(monthly.netProfit)}</p><p className="text-xs text-gray-500">Monthly Net Profit</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-green-600">{formatCurrency(yearly.netProfit)}</p><p className="text-xs text-gray-500">Yearly Net Profit</p></CardContent></Card>
          </div>
        </>
      )}

      {view === 'revenue' && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{store.revenue.length} total revenue entries</p>
            <Button onClick={() => setShowAddRevenue(true)}>
              <DollarSign className="w-4 h-4 mr-2" /> Add Revenue
            </Button>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Revenue Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {revenueBySource.map((r) => {
                  const pct = (r.amount / monthly.totalRevenue) * 100
                  return (
                    <div key={r.source} className="flex items-center justify-between px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-accent" />
                        <span className="text-sm font-medium">{r.source}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-32 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-accent rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-sm font-semibold w-24 text-right">{formatCurrency(r.amount)}</span>
                        <span className="text-xs text-gray-400 w-12 text-right">{pct.toFixed(0)}%</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">All Revenue Entries</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {store.revenue.length === 0 && (
                  <div className="px-5 py-8 text-center text-gray-400">No revenue entries</div>
                )}
                {store.revenue.map((r) => (
                  <div key={r.id} className="flex items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500 w-24">{r.date}</span>
                      <span className="text-sm font-medium">{r.source}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold">{formatCurrency(r.amount)}</span>
                      <button
                        onClick={() => { if (window.confirm('Delete this revenue entry?')) store.deleteRevenue(r.id) }}
                        className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {view === 'expenses' && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{store.expenses.length} expense entries this month</p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowAddCOGS(true)}>
                <ShoppingCart className="w-4 h-4 mr-2" /> Add COGS
              </Button>
              <Button onClick={() => setShowAddExpense(true)}>
                <Wallet className="w-4 h-4 mr-2" /> Add Expense
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Expenses by Category</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {expensesByCategory.map((e) => {
                  const pct = (e.amount / monthly.totalExpenses) * 100
                  return (
                    <div key={e.category}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{e.category}</span>
                        <span className="font-medium">{formatCurrency(e.amount)} ({pct.toFixed(0)}%)</span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${
                          e.category === 'Salaries' ? 'bg-red-400' :
                          e.category === 'Rent' ? 'bg-blue-400' :
                          e.category === 'Utilities' ? 'bg-yellow-400' : 'bg-orange-400'
                        }`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Top Inventory Costs (COGS)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {topCOGS.slice(0, 8).map((item) => {
                  const maxC = topCOGS[0]?.total || 1
                  const pct = (item.total / maxC) * 100
                  return (
                    <div key={item.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{item.name}</span>
                        <span className="font-medium">{formatCurrency(item.total)}</span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-400 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">All Expense Entries</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {store.expenses.length === 0 && (
                  <div className="px-5 py-8 text-center text-gray-400">No expense entries</div>
                )}
                {store.expenses.map((e) => (
                  <div key={e.id} className="flex items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500 w-24">{e.date}</span>
                      <span className="text-sm font-medium">{e.category}</span>
                      {e.description && <span className="text-sm text-gray-400">{e.description}</span>}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-red-600">{formatCurrency(e.amount)}</span>
                      <button
                        onClick={() => { if (window.confirm('Delete this expense entry?')) store.deleteExpense(e.id) }}
                        className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">All COGS Entries</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {store.cogs.length === 0 && (
                  <div className="px-5 py-8 text-center text-gray-400">No COGS entries</div>
                )}
                {store.cogs.map((c) => (
                  <div key={c.id} className="flex items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500 w-24">{c.date}</span>
                      <span className="text-sm font-medium">{c.productName}</span>
                      <span className="text-xs text-gray-400">{c.quantity} {c.unit} x {formatCurrency(c.unitCost)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-purple-600">{formatCurrency(c.totalCost)}</span>
                      <button
                        onClick={() => { if (window.confirm('Delete this COGS entry?')) store.deleteCOGS(c.id) }}
                        className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {showAddRevenue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 space-y-4">
            <h3 className="text-lg font-semibold">Add Revenue</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Date</label>
                <input type="date" className="flex h-9 w-full rounded-xl border bg-background px-3 text-sm" value={revForm.date} onChange={(e) => setRevForm({ ...revForm, date: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Source</label>
                <select className="flex h-9 w-full rounded-xl border bg-background px-3 text-sm" value={revForm.source} onChange={(e) => setRevForm({ ...revForm, source: e.target.value })}>
                  <option>Dine-in</option><option>Takeaway</option><option>Delivery</option><option>Catering</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Amount ($)</label>
                <input type="number" min="0" step="0.01" className="flex h-9 w-full rounded-xl border bg-background px-3 text-sm" value={revForm.amount || ''} onChange={(e) => setRevForm({ ...revForm, amount: parseFloat(e.target.value) || 0 })} />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowAddRevenue(false)}>Cancel</Button>
              <Button onClick={handleAddRevenue}>Add</Button>
            </div>
          </div>
        </div>
      )}

      {showAddExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 space-y-4">
            <h3 className="text-lg font-semibold">Add Expense</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Date</label>
                <input type="date" className="flex h-9 w-full rounded-xl border bg-background px-3 text-sm" value={expForm.date} onChange={(e) => setExpForm({ ...expForm, date: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
                <div className="flex gap-2">
                  {showNewExpCat ? (
                    <div className="flex-1 flex gap-2">
                      <input type="text" placeholder="Type new category" className="flex h-9 w-full rounded-xl border bg-background px-3 text-sm" value={newExpCatName} onChange={(e) => setNewExpCatName(e.target.value)} autoFocus onKeyDown={(e) => { if (e.key === 'Enter') { setExpForm({ ...expForm, category: newExpCatName.trim() }); setShowNewExpCat(false); setNewExpCatName('') } }} />
                      <Button type="button" size="sm" onClick={() => { setExpForm({ ...expForm, category: newExpCatName.trim() }); setShowNewExpCat(false); setNewExpCatName('') }}>
                        <Plus className="w-4 h-4" />
                      </Button>
                      <Button type="button" size="sm" variant="ghost" onClick={() => setShowNewExpCat(false)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <select className="flex h-9 flex-1 rounded-xl border bg-background px-3 text-sm" value={expForm.category} onChange={(e) => setExpForm({ ...expForm, category: e.target.value })}>
                        {store.expenseCategories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                      <Button type="button" size="sm" variant="outline" onClick={() => { setShowNewExpCat(true); setNewExpCatName('') }} className="shrink-0 gap-1">
                        <Tag className="w-3.5 h-3.5" /> New
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                <input type="text" className="flex h-9 w-full rounded-xl border bg-background px-3 text-sm" value={expForm.description} onChange={(e) => setExpForm({ ...expForm, description: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Amount ($)</label>
                <input type="number" min="0" step="0.01" className="flex h-9 w-full rounded-xl border bg-background px-3 text-sm" value={expForm.amount || ''} onChange={(e) => setExpForm({ ...expForm, amount: parseFloat(e.target.value) || 0 })} />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowAddExpense(false)}>Cancel</Button>
              <Button onClick={handleAddExpense}>Add</Button>
            </div>
          </div>
        </div>
      )}

      {showAddCOGS && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 space-y-4">
            <h3 className="text-lg font-semibold">Add Inventory Cost</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Date</label>
                <input type="date" className="flex h-9 w-full rounded-xl border bg-background px-3 text-sm" value={cogsForm.date} onChange={(e) => setCogsForm({ ...cogsForm, date: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Product Name</label>
                <input type="text" className="flex h-9 w-full rounded-xl border bg-background px-3 text-sm" value={cogsForm.productName} onChange={(e) => setCogsForm({ ...cogsForm, productName: e.target.value })} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Quantity</label>
                  <input type="number" min="1" className="flex h-9 w-full rounded-xl border bg-background px-3 text-sm" value={cogsForm.quantity} onChange={(e) => setCogsForm({ ...cogsForm, quantity: parseInt(e.target.value) || 1 })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Unit</label>
                  <select className="flex h-9 w-full rounded-xl border bg-background px-3 text-sm" value={cogsForm.unit} onChange={(e) => setCogsForm({ ...cogsForm, unit: e.target.value })}>
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="L">L</option>
                    <option value="mL">mL</option>
                    <option value="pcs">pcs</option>
                    <option value="pack">pack</option>
                    <option value="box">box</option>
                    <option value="bottle">bottle</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Unit Cost ($)</label>
                  <input type="number" min="0" step="0.01" className="flex h-9 w-full rounded-xl border bg-background px-3 text-sm" value={cogsForm.unitCost || ''} onChange={(e) => setCogsForm({ ...cogsForm, unitCost: parseFloat(e.target.value) || 0 })} />
                </div>
              </div>
              <p className="text-sm text-gray-500">Total: <strong>{cogsForm.quantity} {cogsForm.unit} &times; {formatCurrency(cogsForm.unitCost)} = {formatCurrency(cogsForm.quantity * cogsForm.unitCost)}</strong></p>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowAddCOGS(false)}>Cancel</Button>
              <Button onClick={handleAddCOGS}>Add</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
