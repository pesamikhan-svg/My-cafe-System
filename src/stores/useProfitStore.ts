import { create } from 'zustand'
import { RevenueEntry, ExpenseEntry, COGSEntry, ProfitSummary, ProfitReport, ProfitPeriod, ExpenseCategory, DiscountEntry } from '@/types'
import { useStaffStore } from './useStaffStore'
import * as db from '@/lib/db-api'

function mapEntry(e: any) {
  return { ...e, date: typeof e.date === 'string' ? e.date : e.date.toISOString().split('T')[0] }
}

function getDateRange(period: ProfitPeriod): { start: Date; end: Date } {
  const now = new Date()
  switch (period) {
    case 'daily':
      return {
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
      }
    case 'weekly': {
      const dayOfWeek = now.getDay()
      const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
      return {
        start: new Date(now.getFullYear(), now.getMonth(), diff),
        end: new Date(now.getFullYear(), now.getMonth(), diff + 7),
      }
    }
    case 'monthly':
      return {
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59),
      }
    case 'yearly':
      return {
        start: new Date(now.getFullYear(), 0, 1),
        end: new Date(now.getFullYear(), 11, 31, 23, 59, 59),
      }
  }
}

function computeProfitSummary(
  revenue: RevenueEntry[],
  expenses: ExpenseEntry[],
  cogs: COGSEntry[],
  discounts: DiscountEntry[],
  salaries: number,
  dateFilter?: { start: Date; end: Date }
): Omit<ProfitSummary, 'date'> {
  let rev = revenue
  let exp = expenses
  let cog = cogs
  let disc = discounts

  if (dateFilter) {
    rev = revenue.filter((r) => {
      const d = new Date(r.date)
      return d >= dateFilter.start && d < dateFilter.end
    })
    exp = expenses.filter((r) => {
      const d = new Date(r.date)
      return d >= dateFilter.start && d < dateFilter.end
    })
    cog = cogs.filter((r) => {
      const d = new Date(r.date)
      return d >= dateFilter.start && d < dateFilter.end
    })
    disc = discounts.filter((r) => {
      const d = new Date(r.date)
      return d >= dateFilter.start && d < dateFilter.end
    })
  }

  const totalRevenue = rev.reduce((s: number, r) => s + r.amount, 0)
  const totalCOGS = cog.reduce((s: number, r) => s + r.totalCost, 0)
  const totalExpenses = exp.reduce((s: number, r) => s + r.amount, 0)
  const totalDiscounts = disc.reduce((s: number, r) => s + r.amount, 0)
  const grossProfit = totalRevenue - totalCOGS
  const netProfit = grossProfit - salaries - totalExpenses - totalDiscounts

  return {
    totalRevenue,
    totalCOGS,
    grossProfit,
    totalSalaries: salaries,
    totalExpenses,
    totalDiscounts,
    netProfit,
    profitMargin: totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 10000) / 100 : 0,
  }
}

interface ProfitStore {
  revenue: RevenueEntry[]
  expenses: ExpenseEntry[]
  cogs: COGSEntry[]
  discounts: DiscountEntry[]
  expenseCategories: ExpenseCategory[]
  selectedPeriod: ProfitPeriod
  loading: boolean

  init: () => Promise<void>
  setSelectedPeriod: (p: ProfitPeriod) => void

  addRevenue: (entry: Omit<RevenueEntry, 'id'>) => Promise<void>
  deleteRevenue: (id: string) => Promise<void>

  addExpense: (entry: Omit<ExpenseEntry, 'id'>) => Promise<void>
  deleteExpense: (id: string) => Promise<void>

  addCOGS: (entry: Omit<COGSEntry, 'id'>) => Promise<void>
  deleteCOGS: (id: string) => Promise<void>

  addDiscount: (entry: Omit<DiscountEntry, 'id'>) => Promise<void>

  addExpenseCategory: (cat: Omit<ExpenseCategory, 'id'>) => Promise<void>

  getDailySummary: () => ProfitSummary
  getMonthlySummary: () => ProfitSummary
  getYearlySummary: () => ProfitSummary
  getProfitReports: (period: ProfitPeriod) => ProfitReport[]
  getRevenueBySource: () => { source: string; amount: number }[]
  getExpensesByCategory: () => { category: string; amount: number }[]
  getTopCOGS: (limit?: number) => { name: string; total: number }[]
  getMonthlyProfitTrend: () => { month: string; profit: number; revenue: number }[]
}

export const useProfitStore = create<ProfitStore>((set, get) => ({
  revenue: [],
  expenses: [],
  cogs: [],
  discounts: [],
  expenseCategories: [],
  selectedPeriod: 'monthly',
  loading: true,

  init: async () => {
    const [revenue, expenses, cogs, discounts, categories] = await Promise.all([
      db.revenueGetAll(),
      db.expensesGetAll(),
      db.cogsGetAll(),
      db.discountsGetAll(),
      db.expenseCategoriesGetAll(),
    ])
    set({
      revenue: revenue.map(mapEntry),
      expenses: expenses.map(mapEntry),
      cogs: cogs.map(mapEntry),
      discounts: discounts.map(mapEntry),
      expenseCategories: categories as ExpenseCategory[],
      loading: false,
    })
  },

  setSelectedPeriod: (p) => set({ selectedPeriod: p }),

  addRevenue: async (entry) => {
    const created = await db.revenueCreate(entry)
    set((state) => ({ revenue: [...state.revenue, mapEntry(created)] }))
  },

  deleteRevenue: async (id) => {
    await db.revenueDelete(id)
    set((state) => ({ revenue: state.revenue.filter((r) => r.id !== id) }))
  },

  addExpense: async (entry) => {
    const created = await db.expensesCreate(entry)
    set((state) => ({ expenses: [...state.expenses, mapEntry(created)] }))
  },

  deleteExpense: async (id) => {
    await db.expensesDelete(id)
    set((state) => ({ expenses: state.expenses.filter((e) => e.id !== id) }))
  },

  addCOGS: async (entry) => {
    const created = await db.cogsCreate(entry)
    set((state) => ({ cogs: [...state.cogs, mapEntry(created)] }))
  },

  deleteCOGS: async (id) => {
    await db.cogsDelete(id)
    set((state) => ({ cogs: state.cogs.filter((c) => c.id !== id) }))
  },

  addDiscount: async (entry) => {
    const created = await db.discountsCreate(entry)
    set((state) => ({ discounts: [...state.discounts, mapEntry(created)] }))
  },

  addExpenseCategory: async (cat) => {
    const created = await db.expenseCategoriesCreate(cat)
    set((state) => ({ expenseCategories: [...state.expenseCategories, created as ExpenseCategory] }))
  },

  getDailySummary: () => {
    const range = getDateRange('daily')
    const { salaries } = useStaffStore.getState()
    const todaySalaries = salaries.filter((s: any) => {
      const d = s.paidDate ? new Date(s.paidDate) : null
      return d && d >= range.start && d < range.end
    }).reduce((sum: number, s: any) => sum + s.totalSalary, 0)
    const state = get()
    return {
      date: new Date().toISOString().split('T')[0],
      ...computeProfitSummary(state.revenue, state.expenses, state.cogs, state.discounts, todaySalaries, range),
    }
  },

  getMonthlySummary: () => {
    const range = getDateRange('monthly')
    const { salaries } = useStaffStore.getState()
    const monthSalaries = salaries.filter((s: any) => {
      const d = s.paidDate ? new Date(s.paidDate) : null
      if (!d) return false
      return d >= range.start && d < range.end
    }).reduce((sum: number, s: any) => sum + s.totalSalary, 0)
    const state = get()
    return {
      date: new Date().toISOString().split('T')[0],
      ...computeProfitSummary(state.revenue, state.expenses, state.cogs, state.discounts, monthSalaries, range),
    }
  },

  getYearlySummary: () => {
    const range = getDateRange('yearly')
    const { salaries } = useStaffStore.getState()
    const yearSalaries = salaries.filter((s: any) => {
      const d = s.paidDate ? new Date(s.paidDate) : null
      if (!d) return false
      return d >= range.start && d < range.end
    }).reduce((sum: number, s: any) => sum + s.totalSalary, 0)
    const state = get()
    return {
      date: new Date().toISOString().split('T')[0],
      ...computeProfitSummary(state.revenue, state.expenses, state.cogs, state.discounts, yearSalaries, range),
    }
  },

  getProfitReports: (period) => {
    const state = get()
    const { salaries } = useStaffStore.getState()
    const now = new Date()
    const reports: ProfitReport[] = []

    if (period === 'monthly') {
      for (let m = 0; m < 12; m++) {
        const d = new Date(now.getFullYear(), m, 1)
        const start = new Date(now.getFullYear(), m, 1)
        const end = new Date(now.getFullYear(), m + 1, 0, 23, 59, 59)
        const monthSalaries = salaries
          .filter((s: any) => s.month === m + 1 && s.year === now.getFullYear())
          .reduce((sum: number, s: any) => sum + s.totalSalary, 0)
        const summary = computeProfitSummary(state.revenue, state.expenses, state.cogs, state.discounts, monthSalaries, { start, end })
        reports.push({
          period: 'monthly',
          label: d.toLocaleString('default', { month: 'short', year: 'numeric' }),
          ...summary,
        })
      }
    } else if (period === 'daily') {
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
      for (let day = 1; day <= daysInMonth; day++) {
        const d = new Date(now.getFullYear(), now.getMonth(), day)
        const start = new Date(now.getFullYear(), now.getMonth(), day)
        const end = new Date(now.getFullYear(), now.getMonth(), day + 1)
        const summary = computeProfitSummary(state.revenue, state.expenses, state.cogs, state.discounts, 0, { start, end })
        reports.push({
          period: 'daily',
          label: d.toLocaleString('default', { day: 'numeric', month: 'short' }),
          ...summary,
        })
      }
    }

    return reports
  },

  getRevenueBySource: () => {
    const range = getDateRange('monthly')
    const state = get()
    const grouped: Record<string, number> = {}
    state.revenue.forEach((r) => {
      const d = new Date(r.date)
      if (d >= range.start && d < range.end) {
        grouped[r.source] = (grouped[r.source] || 0) + r.amount
      }
    })
    return Object.entries(grouped).map(([source, amount]) => ({ source, amount: Math.round(amount * 100) / 100 }))
  },

  getExpensesByCategory: () => {
    const range = getDateRange('monthly')
    const state = get()
    const grouped: Record<string, number> = {}
    state.expenses.forEach((e) => {
      const d = new Date(e.date)
      if (d >= range.start && d < range.end) {
        grouped[e.category] = (grouped[e.category] || 0) + e.amount
      }
    })
    return Object.entries(grouped).map(([category, amount]) => ({ category, amount: Math.round(amount * 100) / 100 }))
  },

  getTopCOGS: (limit = 5) => {
    const range = getDateRange('monthly')
    const state = get()
    const grouped: Record<string, number> = {}
    state.cogs.forEach((c) => {
      const d = new Date(c.date)
      if (d >= range.start && d < range.end) {
        grouped[c.productName] = (grouped[c.productName] || 0) + c.totalCost
      }
    })
    return Object.entries(grouped)
      .map(([name, total]) => ({ name, total: Math.round(total * 100) / 100 }))
      .sort((a, b) => b.total - a.total)
      .slice(0, limit)
  },

  getMonthlyProfitTrend: () => {
    const state = get()
    const now = new Date()
    const months: { month: string; profit: number; revenue: number }[] = []
    for (let m = 0; m < 12; m++) {
      const d = new Date(now.getFullYear(), m, 1)
      const start = new Date(now.getFullYear(), m, 1)
      const end = new Date(now.getFullYear(), m + 1, 0, 23, 59, 59)
      const rev = state.revenue
        .filter((r) => {
          const rd = new Date(r.date)
          return rd >= start && rd < end
        })
        .reduce((s: number, r) => s + r.amount, 0)
      const cog = state.cogs
        .filter((c) => {
          const cd = new Date(c.date)
          return cd >= start && cd < end
        })
        .reduce((s: number, c) => s + c.totalCost, 0)
      months.push({
        month: d.toLocaleString('default', { month: 'short' }),
        profit: Math.round((rev - cog) * 100) / 100,
        revenue: Math.round(rev * 100) / 100,
      })
    }
    return months
  },
}))
