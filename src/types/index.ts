export interface Product {
  id: string
  name: string
  price: number
  category: string
  image: string
  description?: string
  available: boolean
  sizes?: string[]
  stock?: number
}

export interface CartItem {
  product: Product
  quantity: number
  notes?: string
}

export interface Category {
  id: string
  name: string
  icon: string
}

export interface Order {
  id: string
  invoiceNumber?: string
  items: CartItem[]
  subtotal: number
  discount: number
  tax: number
  serviceCharge: number
  total: number
  status: 'pending' | 'completed' | 'cancelled' | 'held' | 'draft'
  tableNumber?: number
  customerName?: string
  createdAt: Date
  payments?: Payment[]
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  totalOrders: number
  totalSpent: number
}

export interface SaleReport {
  date: string
  totalSales: number
  totalOrders: number
  averageOrderValue: number
  items: { name: string; quantity: number; revenue: number }[]
}

export type MenuItem = {
  id: string
  label: string
  icon: string
  path: string
}

export type StaffRole = 'admin' | 'cashier' | 'staff'

export interface Staff {
  id: string
  staffId: string
  fullName: string
  email?: string
  phone: string
  cnic: string
  address?: string
  joiningDate: string
  position: string
  basicSalary: number
  profilePhoto?: string
  isAdmin: boolean
  isActive: boolean
  role: StaffRole
}

export type AttendanceStatus = 'present' | 'absent' | 'leave'

export interface Attendance {
  id: string
  staffId: string
  date: string
  checkIn?: string
  checkOut?: string
  status: AttendanceStatus
  hoursWorked?: number
  notes?: string
}

export interface SalaryRecord {
  id: string
  staffId: string
  month: number
  year: number
  basicSalary: number
  overtimeHours: number
  overtimeRate: number
  overtimePay: number
  bonuses: number
  allowances: number
  deductions: number
  advanceDeduction: number
  latePenalties: number
  totalSalary: number
  paid: boolean
  paidDate?: string
  notes?: string
}

export interface Payroll {
  id: string
  staffId: string
  month: number
  year: number
  generatedDate: string
  totalSalaries: number
  status: 'pending' | 'paid' | 'cancelled'
}

export interface StaffFormData {
  fullName: string
  email?: string
  phone: string
  cnic: string
  address?: string
  joiningDate: string
  position: string
  basicSalary: number
  profilePhoto?: string
  isAdmin: boolean
  role: StaffRole
}

export interface RevenueEntry {
  id: string
  date: string
  amount: number
  source: string
  notes?: string
}

export interface ExpenseEntry {
  id: string
  date: string
  amount: number
  category: string
  description: string
  isSalary?: boolean
  notes?: string
}

export interface COGSEntry {
  id: string
  date: string
  productName: string
  quantity: number
  unit: string
  unitCost: number
  totalCost: number
  notes?: string
}

export interface ProfitSummary {
  date: string
  totalRevenue: number
  totalCOGS: number
  grossProfit: number
  totalSalaries: number
  totalExpenses: number
  totalDiscounts: number
  netProfit: number
  profitMargin: number
}

export type ProfitPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly'

export interface ProfitReport {
  period: ProfitPeriod
  label: string
  totalRevenue: number
  totalCOGS: number
  grossProfit: number
  totalSalaries: number
  totalExpenses: number
  totalDiscounts: number
  netProfit: number
  profitMargin: number
}

export interface ExpenseCategory {
  id: string
  name: string
  icon: string
  budget: number
}

export type PaymentMethod = 'cash' | 'card' | 'mobile' | 'wallet'

export interface Payment {
  id: string
  orderId: string
  amount: number
  method: string
  status: string
  createdAt: string
  order?: any
}

export interface Table {
  id: number
  seats: number
  status: string
  server: string | null
}

export interface Reservation {
  id: string
  name: string
  guests: number
  time: string
  date: string
  status: string
  phone?: string
  tableId?: number | null
  createdAt?: string
}

export interface DiscountEntry {
  id: string
  date: string
  amount: number
  reason?: string
}
