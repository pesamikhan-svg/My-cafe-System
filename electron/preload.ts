import { contextBridge, ipcRenderer } from 'electron'

const api = {
  // Meta
  metaGet: (id: string) => ipcRenderer.invoke('meta:get', id),
  metaSet: (id: string, value: string) => ipcRenderer.invoke('meta:set', id, value),

  // Staff
  staffGetAll: () => ipcRenderer.invoke('staff:getAll'),
  staffGetById: (id: string) => ipcRenderer.invoke('staff:getById', id),
  staffCreate: (data: any) => ipcRenderer.invoke('staff:create', data),
  staffUpdate: (id: string, data: any) => ipcRenderer.invoke('staff:update', id, data),
  staffDelete: (id: string) => ipcRenderer.invoke('staff:delete', id),

  // Attendance
  attendanceGetByStaff: (staffId: string, month: number, year: number) =>
    ipcRenderer.invoke('attendance:getByStaff', staffId, month, year),
  attendanceUpsert: (data: any) => ipcRenderer.invoke('attendance:upsert', data),

  // Salary
  salaryGetAll: () => ipcRenderer.invoke('salary:getAll'),
  salaryCreate: (data: any) => ipcRenderer.invoke('salary:create', data),
  salaryUpdate: (id: string, data: any) => ipcRenderer.invoke('salary:update', id, data),
  salaryMarkPaid: (id: string) => ipcRenderer.invoke('salary:markPaid', id),

  // Payroll
  payrollGetAll: () => ipcRenderer.invoke('payroll:getAll'),
  payrollCreate: (data: any) => ipcRenderer.invoke('payroll:create', data),
  payrollUpdate: (id: string, data: any) => ipcRenderer.invoke('payroll:update', id, data),

  // Products
  productsGetAll: () => ipcRenderer.invoke('products:getAll'),
  productsCreate: (data: any) => ipcRenderer.invoke('products:create', data),
  productsUpdate: (id: string, data: any) => ipcRenderer.invoke('products:update', id, data),
  productsDelete: (id: string) => ipcRenderer.invoke('products:delete', id),

  // Categories
  categoriesGetAll: () => ipcRenderer.invoke('categories:getAll'),
  categoriesCreate: (data: any) => ipcRenderer.invoke('categories:create', data),

  // Orders
  ordersGetAll: () => ipcRenderer.invoke('orders:getAll'),
  ordersGetById: (id: string) => ipcRenderer.invoke('orders:getById', id),
  ordersCreate: (data: any) => ipcRenderer.invoke('orders:create', data),
  ordersUpdate: (id: string, data: any) => ipcRenderer.invoke('orders:update', id, data),
  ordersDelete: (id: string) => ipcRenderer.invoke('orders:delete', id),

  // Payments
  paymentsGetAll: () => ipcRenderer.invoke('payments:getAll'),
  paymentsCreate: (data: any) => ipcRenderer.invoke('payments:create', data),

  // Customers
  customersGetAll: () => ipcRenderer.invoke('customers:getAll'),
  customersCreate: (data: any) => ipcRenderer.invoke('customers:create', data),
  customersUpdate: (id: string, data: any) => ipcRenderer.invoke('customers:update', id, data),
  customersDelete: (id: string) => ipcRenderer.invoke('customers:delete', id),

  // Tables
  tablesGetAll: () => ipcRenderer.invoke('tables:getAll'),
  tablesCreate: (data: any) => ipcRenderer.invoke('tables:create', data),
  tablesUpdate: (id: number, data: any) => ipcRenderer.invoke('tables:update', id, data),
  tablesDelete: (id: number) => ipcRenderer.invoke('tables:delete', id),
  tablesResetAll: () => ipcRenderer.invoke('tables:resetAll'),

  // Reservations
  reservationsGetAll: () => ipcRenderer.invoke('reservations:getAll'),
  reservationsCreate: (data: any) => ipcRenderer.invoke('reservations:create', data),
  reservationsUpdate: (id: string, data: any) => ipcRenderer.invoke('reservations:update', id, data),
  reservationsDelete: (id: string) => ipcRenderer.invoke('reservations:delete', id),

  // Profit & Loss
  revenueGetAll: () => ipcRenderer.invoke('revenue:getAll'),
  revenueCreate: (data: any) => ipcRenderer.invoke('revenue:create', data),
  revenueDelete: (id: string) => ipcRenderer.invoke('revenue:delete', id),

  expensesGetAll: () => ipcRenderer.invoke('expenses:getAll'),
  expensesCreate: (data: any) => ipcRenderer.invoke('expenses:create', data),
  expensesDelete: (id: string) => ipcRenderer.invoke('expenses:delete', id),

  cogsGetAll: () => ipcRenderer.invoke('cogs:getAll'),
  cogsCreate: (data: any) => ipcRenderer.invoke('cogs:create', data),
  cogsDelete: (id: string) => ipcRenderer.invoke('cogs:delete', id),

  discountsGetAll: () => ipcRenderer.invoke('discounts:getAll'),
  discountsCreate: (data: any) => ipcRenderer.invoke('discounts:create', data),

  expenseCategoriesGetAll: () => ipcRenderer.invoke('expenseCategories:getAll'),
  expenseCategoriesCreate: (data: any) => ipcRenderer.invoke('expenseCategories:create', data),

  backupCreate: () => ipcRenderer.invoke('backup:create'),
  backupRestore: () => ipcRenderer.invoke('backup:restore'),
  getAppPath: () => ipcRenderer.invoke('get-app-path'),
}

contextBridge.exposeInMainWorld('electronAPI', api)
