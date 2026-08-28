import { Product, Category, Customer, Staff, Attendance, SalaryRecord, Payroll, AttendanceStatus, RevenueEntry, ExpenseEntry, COGSEntry, ExpenseCategory } from '@/types'

export const categories: Category[] = [
  { id: 'all', name: 'All Items', icon: 'grid' },
  { id: 'coffee', name: 'Coffee', icon: 'coffee' },
  { id: 'tea', name: 'Tea', icon: 'wine' },
  { id: 'cold-drinks', name: 'Cold Drinks', icon: 'glass-water' },
  { id: 'desserts', name: 'Desserts', icon: 'cake' },
  { id: 'snacks', name: 'Snacks', icon: 'cookie' },
]

export const products: Product[] = [
  { id: 'p1', name: 'Espresso', price: 3.50, category: 'coffee', image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=200&h=200&fit=crop', available: true },
  { id: 'p2', name: 'Cappuccino', price: 4.50, category: 'coffee', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=200&h=200&fit=crop', available: true },
  { id: 'p3', name: 'Latte', price: 4.75, category: 'coffee', image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=200&h=200&fit=crop', available: true },
  { id: 'p4', name: 'Mocha', price: 5.25, category: 'coffee', image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=200&h=200&fit=crop', available: true },
  { id: 'p5', name: 'Americano', price: 3.75, category: 'coffee', image: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=200&h=200&fit=crop', available: true },
  { id: 'p6', name: 'Green Tea', price: 3.00, category: 'tea', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=200&h=200&fit=crop', available: true },
  { id: 'p7', name: 'Chai Latte', price: 4.25, category: 'tea', image: 'https://images.unsplash.com/photo-1563822249366-3c48b73b15e1?w=200&h=200&fit=crop', available: true },
  { id: 'p8', name: 'Iced Tea', price: 3.50, category: 'tea', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=200&h=200&fit=crop', available: true },
  { id: 'p9', name: 'Matcha Latte', price: 5.00, category: 'tea', image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=200&h=200&fit=crop', available: true },
  { id: 'p10', name: 'Iced Coffee', price: 4.00, category: 'cold-drinks', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=200&h=200&fit=crop', available: true },
  { id: 'p11', name: 'Frappuccino', price: 5.50, category: 'cold-drinks', image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=200&h=200&fit=crop', available: true },
  { id: 'p12', name: 'Smoothie', price: 5.75, category: 'cold-drinks', image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=200&h=200&fit=crop', available: true },
  { id: 'p13', name: 'Lemonade', price: 3.50, category: 'cold-drinks', image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=200&h=200&fit=crop', available: true },
  { id: 'p14', name: 'Cheesecake', price: 6.50, category: 'desserts', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=200&h=200&fit=crop', available: true },
  { id: 'p15', name: 'Brownie', price: 4.50, category: 'desserts', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=200&h=200&fit=crop', available: true },
  { id: 'p16', name: 'Croissant', price: 3.75, category: 'snacks', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=200&h=200&fit=crop', available: true },
  { id: 'p17', name: 'Sandwich', price: 7.50, category: 'snacks', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=200&h=200&fit=crop', available: true },
  { id: 'p18', name: 'Cookie', price: 2.50, category: 'snacks', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=200&h=200&fit=crop', available: true },
  { id: 'p19', name: 'Muffin', price: 3.50, category: 'desserts', image: 'https://images.unsplash.com/photo-1559304822-4f28a514c9bc?w=200&h=200&fit=crop', available: true },
  { id: 'p20', name: 'Cold Brew', price: 4.50, category: 'cold-drinks', image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=200&h=200&fit=crop', available: true },
]

export const customers: Customer[] = [
  { id: 'c1', name: 'John Smith', email: 'john@email.com', phone: '+1 555-0101', totalOrders: 24, totalSpent: 342.50 },
  { id: 'c2', name: 'Sarah Johnson', email: 'sarah@email.com', phone: '+1 555-0102', totalOrders: 18, totalSpent: 256.75 },
  { id: 'c3', name: 'Mike Wilson', email: 'mike@email.com', phone: '+1 555-0103', totalOrders: 31, totalSpent: 489.20 },
  { id: 'c4', name: 'Emma Davis', email: 'emma@email.com', phone: '+1 555-0104', totalOrders: 12, totalSpent: 178.00 },
  { id: 'c5', name: 'Alex Brown', email: 'alex@email.com', phone: '+1 555-0105', totalOrders: 45, totalSpent: 623.40 },
]

export const staffMembers: Staff[] = [
  { id: 's1', staffId: 'STF-001', fullName: 'Admin User', phone: '+1 555-1001', cnic: 'CNIC-001', address: '123 Main St, City', joiningDate: '2024-01-01', position: 'Manager', basicSalary: 5000, isAdmin: true, isActive: true, email: 'admin@cafe.com', role: 'admin' },
  { id: 's2', staffId: 'STF-002', fullName: 'Cashier User', phone: '+1 555-1002', cnic: 'CNIC-002', address: '456 Oak Ave, City', joiningDate: '2024-01-15', position: 'Cashier', basicSalary: 2500, isAdmin: false, isActive: true, email: 'cashier@cafe.com', role: 'cashier' },
  { id: 's3', staffId: 'STF-003', fullName: 'Sarah Johnson', phone: '+1 555-1003', cnic: 'CNIC-003', address: '789 Pine Rd, City', joiningDate: '2024-02-01', position: 'Chef', basicSalary: 3500, isAdmin: false, isActive: true, email: 'sarah@cafe.com', role: 'staff' },
  { id: 's4', staffId: 'STF-004', fullName: 'Mike Wilson', phone: '+1 555-1004', cnic: 'CNIC-004', address: '321 Elm St, City', joiningDate: '2024-02-15', position: 'Barista', basicSalary: 2500, isAdmin: false, isActive: true, email: 'mike@cafe.com', role: 'staff' },
  { id: 's5', staffId: 'STF-005', fullName: 'Emma Davis', phone: '+1 555-1005', cnic: 'CNIC-005', address: '654 Maple Dr, City', joiningDate: '2024-03-01', position: 'Waiter', basicSalary: 2000, isAdmin: false, isActive: true, email: 'emma@cafe.com', role: 'staff' },
  { id: 's6', staffId: 'STF-006', fullName: 'Alex Brown', phone: '+1 555-1006', cnic: 'CNIC-006', address: '987 Cedar Ln, City', joiningDate: '2024-03-15', position: 'Cashier', basicSalary: 2200, isAdmin: false, isActive: true, email: 'alex@cafe.com', role: 'staff' },
  { id: 's7', staffId: 'STF-007', fullName: 'Lisa Chen', phone: '+1 555-1007', cnic: 'CNIC-007', address: '147 Birch Ct, City', joiningDate: '2024-04-01', position: 'Barista', basicSalary: 2400, isAdmin: false, isActive: true, email: 'lisa@cafe.com', role: 'staff' },
  { id: 's8', staffId: 'STF-008', fullName: 'James Wilson', phone: '+1 555-1008', cnic: 'CNIC-008', address: '258 Walnut Ave, City', joiningDate: '2024-04-15', position: 'Waiter', basicSalary: 2000, isAdmin: false, isActive: true, email: 'james@cafe.com', role: 'staff' },
  { id: 's9', staffId: 'STF-009', fullName: 'Maria Garcia', phone: '+1 555-1009', cnic: 'CNIC-009', address: '369 Walnut Ave, City', joiningDate: '2024-05-01', position: 'Cleaner', basicSalary: 1800, isAdmin: false, isActive: false, role: 'staff' },
]

const today = new Date()
const currentMonth = today.getMonth()
const currentYear = today.getFullYear()

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month + 1, 0).getDate()
}

export const attendanceRecords: Attendance[] = (() => {
  const records: Attendance[] = []
  const daysInMonth = getDaysInMonth(currentMonth, currentYear)
  const activeStaff = staffMembers.filter(s => s.isActive)

  activeStaff.forEach(staff => {
    for (let day = 1; day <= daysInMonth; day++) {
      if (day > 28) break
      const date = new Date(currentYear, currentMonth, day)
      if (date.getDay() === 0) continue

      const statuses: AttendanceStatus[] = ['present', 'present', 'present', 'present', 'present', 'absent', 'leave']
      const status = statuses[Math.floor(Math.random() * statuses.length)] as AttendanceStatus

      const record: Attendance = {
        id: `att-${staff.id}-${day}`,
        staffId: staff.id,
        date: formatDate(date),
        status,
      }

      if (status === 'present') {
        record.checkIn = '09:00'
        record.checkOut = '18:00'
        record.hoursWorked = 9
      }

      records.push(record)
    }
  })
  return records
})()

export const salaryRecords: SalaryRecord[] = staffMembers.filter(s => s.isActive).map(staff => {
  const overtimeHours = Math.floor(Math.random() * 20)
  const overtimeRate = staff.basicSalary / 200
  const overtimePay = overtimeHours * overtimeRate
  const bonuses = Math.random() > 0.5 ? 100 : 0
  const allowances = 200
  const deductions = Math.random() > 0.5 ? 50 : 0
  const latePenalties = Math.floor(Math.random() * 3) * 20
  const totalSalary = staff.basicSalary + overtimePay + bonuses + allowances - deductions - latePenalties

  return {
    id: `sal-${staff.id}-${currentMonth}`,
    staffId: staff.id,
    month: currentMonth + 1,
    year: currentYear,
    basicSalary: staff.basicSalary,
    overtimeHours,
    overtimeRate: Math.round(overtimeRate * 100) / 100,
    overtimePay: Math.round(overtimePay * 100) / 100,
    bonuses,
    allowances,
    deductions,
    advanceDeduction: 0,
    latePenalties,
    totalSalary: Math.round(totalSalary * 100) / 100,
    paid: Math.random() > 0.3,
  }
})

export const payrollRecords: Payroll[] = (() => {
  const months = []
  for (let i = 0; i < 3; i++) {
    const m = currentMonth - i
    const month = ((m % 12) + 12) % 12
    const year = m < 0 ? currentYear - 1 : currentYear
    const totalSalaries = staffMembers.filter(s => s.isActive).reduce((sum, s) => sum + s.basicSalary, 0)
    months.push({
      id: `pay-${month}-${year}`,
      staffId: 's1',
      month: month + 1,
      year,
      generatedDate: formatDate(new Date(year, month, 1)),
      totalSalaries: Math.round(totalSalaries * 1.1 * 100) / 100,
      status: i === 0 ? 'pending' as const : 'paid' as const,
    })
  }
  return months
})()

export const expenseCategories: ExpenseCategory[] = [
  { id: 'ec1', name: 'Utilities', icon: 'zap', budget: 500 },
  { id: 'ec2', name: 'Rent', icon: 'building', budget: 2000 },
  { id: 'ec3', name: 'Supplies', icon: 'package', budget: 800 },
  { id: 'ec4', name: 'Maintenance', icon: 'wrench', budget: 400 },
  { id: 'ec5', name: 'Marketing', icon: 'megaphone', budget: 300 },
  { id: 'ec6', name: 'Insurance', icon: 'shield', budget: 250 },
  { id: 'ec7', name: 'Other', icon: 'more-horizontal', budget: 200 },
]

export const revenueEntries: RevenueEntry[] = (() => {
  const entries: RevenueEntry[] = []
  const sources = ['Dine-in', 'Takeaway', 'Delivery', 'Catering']
  for (let day = 1; day <= 28; day++) {
    const date = formatDate(new Date(currentYear, currentMonth, day))
    const dailySources = sources.map(s => ({
      id: `rev-${day}-${s}`,
      date,
      amount: Math.round((150 + Math.random() * 350) * 100) / 100,
      source: s,
    }))
    entries.push(...dailySources)
  }
  return entries
})()

export const expenseEntries: ExpenseEntry[] = (() => {
  const entries: ExpenseEntry[] = []
  const categories = ['Utilities', 'Rent', 'Supplies', 'Maintenance', 'Marketing', 'Insurance', 'Other']
  const staffSalary = salaryRecords.filter(s => s.paid)
  for (let day = 1; day <= 28; day++) {
    const date = formatDate(new Date(currentYear, currentMonth, day))
    if (day === 1) {
      entries.push({
        id: `exp-rent-${day}`,
        date,
        amount: 2000,
        category: 'Rent',
        description: 'Monthly Rent',
      })
    }
    const dailyExpenses = categories.filter(c => c !== 'Rent').map(c => ({
      id: `exp-${c}-${day}`,
      date,
      amount: Math.round((10 + Math.random() * 60) * 100) / 100,
      category: c,
      description: `${c} - Day ${day}`,
    }))
    entries.push(...dailyExpenses)
  }
  staffSalary.forEach(s => {
    entries.push({
      id: `exp-salary-${s.id}`,
      date: s.paidDate || formatDate(new Date()),
      amount: s.totalSalary,
      category: 'Salaries',
      description: `Salary - ${s.month}/${s.year}`,
      isSalary: true,
    })
  })
  return entries
})()

export const cogsEntries: COGSEntry[] = (() => {
  const entries: COGSEntry[] = []
  const ingredients = [
    { name: 'Coffee Beans', cost: 8, unit: 'kg' },
    { name: 'Milk', cost: 3, unit: 'L' },
    { name: 'Sugar', cost: 1.5, unit: 'kg' },
    { name: 'Flour', cost: 2, unit: 'kg' },
    { name: 'Chocolate', cost: 4, unit: 'kg' },
    { name: 'Tea Leaves', cost: 5, unit: 'kg' },
    { name: 'Syrups', cost: 3.5, unit: 'L' },
    { name: 'Cups & Lids', cost: 2.5, unit: 'pcs' },
  ]
  for (let day = 1; day <= 28; day++) {
    const date = formatDate(new Date(currentYear, currentMonth, day))
    ingredients.forEach(ing => {
      const qty = Math.floor(1 + Math.random() * 5)
      entries.push({
        id: `cogs-${ing.name}-${day}`,
        date,
        productName: ing.name,
        quantity: qty,
        unit: ing.unit,
        unitCost: ing.cost,
        totalCost: Math.round(qty * ing.cost * 100) / 100,
      })
    })
  }
  return entries
})()

export const discountEntries: { date: string; amount: number }[] = (() => {
  const entries: { date: string; amount: number }[] = []
  for (let day = 1; day <= 28; day++) {
    const date = formatDate(new Date(currentYear, currentMonth, day))
    entries.push({
      date,
      amount: Math.round((5 + Math.random() * 25) * 100) / 100,
    })
  }
  return entries
})()

