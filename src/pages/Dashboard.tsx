import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useStaffStore } from '@/stores/useStaffStore'
import { useProfitStore } from '@/stores/useProfitStore'
import { formatCurrency } from '@/lib/utils'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Clock,
  ArrowUp,
  ArrowDown,
  UserCheck,
  Wallet,
  Percent,
} from 'lucide-react'

export default function Dashboard() {
  const staffInit = useStaffStore((s) => s.init)
  const profitInit = useProfitStore((s) => s.init)
  const staff = useStaffStore((s) => s.staff)
  const salaries = useStaffStore((s) => s.salaries)
  const staffLoading = useStaffStore((s) => s.loading)
  const profitLoading = useProfitStore((s) => s.loading)

  useEffect(() => { staffInit(); profitInit() }, [staffInit, profitInit])

  const { getDailySummary, getMonthlySummary, getRevenueBySource, getTopCOGS } = useProfitStore()

  if (staffLoading || profitLoading) {
    return (
      <div className="flex-1 min-h-0 overflow-y-auto p-6 animate-fade-in">
        <div className="flex items-center justify-center h-full text-gray-400">Loading dashboard...</div>
      </div>
    )
  }

  const activeStaff = staff.filter((s) => s.isActive)
  const unpaidSalaries = salaries.filter((s) => !s.paid)
  const totalSalaryExpense = salaries.reduce((sum, s) => sum + s.totalSalary, 0)
  const paidAmount = salaries.filter((s) => s.paid).reduce((sum, s) => sum + s.totalSalary, 0)

  const dailySummary = getDailySummary()
  const monthlySummary = getMonthlySummary()
  const revenueBySource = getRevenueBySource()
  const topCogs = getTopCOGS(5)

  const stats = [
    {
      label: 'Today Revenue',
      value: formatCurrency(dailySummary.totalRevenue),
      change: dailySummary.profitMargin + '% margin',
      up: dailySummary.netProfit >= 0,
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-50 dark:bg-green-500/10'
    },
    {
      label: 'Active Staff',
      value: activeStaff.length.toString(),
      change: unpaidSalaries.length + ' unpaid salaries',
      up: unpaidSalaries.length === 0,
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-50 dark:bg-purple-500/10'
    },
    {
      label: 'Salary Expense',
      value: formatCurrency(totalSalaryExpense),
      change: formatCurrency(paidAmount) + ' paid',
      up: true,
      icon: Wallet,
      color: 'text-accent',
      bg: 'bg-accent/5'
    },
    {
      label: 'Profit Margin',
      value: monthlySummary.profitMargin + '%',
      change: formatCurrency(monthlySummary.netProfit) + ' net',
      up: monthlySummary.netProfit >= 0,
      icon: Percent,
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-500/10'
    },
  ]

  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of your cafe performance</p>
        </div>
        <Badge variant="success" className="gap-1.5">
          <TrendingUp className="w-3.5 h-3.5" />
          Live
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    <div className="flex items-center gap-1 text-xs">
                      {stat.up ? (
                        <ArrowUp className="w-3 h-3 text-green-500" />
                      ) : (
                        <ArrowDown className="w-3 h-3 text-red-500" />
                      )}
                      <span className={stat.up ? 'text-green-600' : 'text-red-600'}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bg}`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Today's Profit</p>
                <p className={`text-2xl font-bold ${dailySummary.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(dailySummary.netProfit)}
                </p>
                <div className="flex items-center gap-1 text-xs">
                  {dailySummary.profitMargin >= 0 ? <ArrowUp className="w-3 h-3 text-green-500" /> : <ArrowDown className="w-3 h-3 text-red-500" />}
                  <span className={dailySummary.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}>{dailySummary.profitMargin}%</span>
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
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Monthly Profit</p>
                <p className={`text-2xl font-bold ${monthlySummary.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(monthlySummary.netProfit)}
                </p>
                <p className="text-xs text-gray-400">{monthlySummary.profitMargin}% margin</p>
              </div>
              <div className="p-3 rounded-xl bg-accent/5">
                <Percent className="w-5 h-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(monthlySummary.totalRevenue)}</p>
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
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(monthlySummary.totalSalaries + monthlySummary.totalExpenses)}</p>
                <p className="text-xs text-gray-400">incl. salaries</p>
              </div>
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10">
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Revenue by Source</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {revenueBySource.map((r) => {
              const pct = monthlySummary.totalRevenue > 0 ? (r.amount / monthlySummary.totalRevenue) * 100 : 0
              return (
                <div key={r.source}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">{r.source}</span>
                    <span className="font-medium">{formatCurrency(r.amount)}</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Top Inventory Costs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCogs.length === 0 && <p className="text-sm text-gray-400 text-center py-8">No COGS data</p>}
              {topCogs.map((item, i) => {
                const maxC = topCogs[0]?.total || 1
                return (
                  <div key={item.name} className="flex items-center gap-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 text-xs font-bold text-gray-500 dark:text-gray-300">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
                      <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mt-1">
                        <div className="h-full bg-purple-400 rounded-full" style={{ width: `${(item.total / maxC) * 100}%` }} />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(item.total)}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
