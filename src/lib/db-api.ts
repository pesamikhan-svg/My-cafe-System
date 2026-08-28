import type {
  Staff, Attendance, SalaryRecord, Payroll,
  Product, Category, Order,
} from '@/types'

declare global {
  interface Window {
    electronAPI: {
      metaGet: (id: string) => Promise<string | null>
      metaSet: (id: string, value: string) => Promise<void>
      staffGetAll: () => Promise<any[]>
      staffGetById: (id: string) => Promise<any>
      staffCreate: (data: any) => Promise<any>
      staffUpdate: (id: string, data: any) => Promise<any>
      staffDelete: (id: string) => Promise<any>
      attendanceGetByStaff: (staffId: string, month: number, year: number) => Promise<any[]>
      attendanceUpsert: (data: any) => Promise<any>
      salaryGetAll: () => Promise<any[]>
      salaryCreate: (data: any) => Promise<any>
      salaryUpdate: (id: string, data: any) => Promise<any>
      salaryMarkPaid: (id: string) => Promise<any>
      payrollGetAll: () => Promise<any[]>
      payrollCreate: (data: any) => Promise<any>
      payrollUpdate: (id: string, data: any) => Promise<any>
      productsGetAll: () => Promise<any[]>
      productsCreate: (data: any) => Promise<any>
      productsUpdate: (id: string, data: any) => Promise<any>
      productsDelete: (id: string) => Promise<any>
      categoriesGetAll: () => Promise<any[]>
      categoriesCreate: (data: any) => Promise<any>
      ordersGetAll: () => Promise<any[]>
      ordersGetById: (id: string) => Promise<any>
      ordersCreate: (data: any) => Promise<any>
      ordersUpdate: (id: string, data: any) => Promise<any>
      ordersDelete: (id: string) => Promise<any>
      paymentsGetAll: () => Promise<any[]>
      paymentsCreate: (data: any) => Promise<any>
      customersGetAll: () => Promise<any[]>
      customersCreate: (data: any) => Promise<any>
      customersUpdate: (id: string, data: any) => Promise<any>
      customersDelete: (id: string) => Promise<any>
      tablesGetAll: () => Promise<any[]>
      tablesCreate: (data: any) => Promise<any>
      tablesUpdate: (id: number, data: any) => Promise<any>
      tablesDelete: (id: number) => Promise<any>
      tablesResetAll: () => Promise<any[]>
      reservationsGetAll: () => Promise<any[]>
      reservationsCreate: (data: any) => Promise<any>
      reservationsUpdate: (id: string, data: any) => Promise<any>
      reservationsDelete: (id: string) => Promise<any>
      revenueGetAll: () => Promise<any[]>
      revenueCreate: (data: any) => Promise<any>
      revenueDelete: (id: string) => Promise<void>
      expensesGetAll: () => Promise<any[]>
      expensesCreate: (data: any) => Promise<any>
      expensesDelete: (id: string) => Promise<void>
      cogsGetAll: () => Promise<any[]>
      cogsCreate: (data: any) => Promise<any>
      cogsDelete: (id: string) => Promise<void>
      discountsGetAll: () => Promise<any[]>
      discountsCreate: (data: any) => Promise<any>
      expenseCategoriesGetAll: () => Promise<any[]>
      expenseCategoriesCreate: (data: any) => Promise<any>
      backupCreate: () => Promise<boolean>
      backupRestore: () => Promise<boolean>
      getAppPath: () => Promise<string>
    }
  }
}

const api = () => {
  if (!window.electronAPI) {
    throw new Error('electronAPI not available - app must be running in Electron')
  }
  return window.electronAPI
}

export const metaGet = (id: string) => api().metaGet(id)
export const metaSet = (id: string, value: string) => api().metaSet(id, value)

export const staffGetAll = (): Promise<Staff[]> => api().staffGetAll()
export const staffGetById = (id: string) => api().staffGetById(id)
export const staffCreate = (data: any) => api().staffCreate(data)
export const staffUpdate = (id: string, data: any) => api().staffUpdate(id, data)
export const staffDelete = (id: string) => api().staffDelete(id)

export const attendanceGetByStaff = (staffId: string, month: number, year: number) =>
  api().attendanceGetByStaff(staffId, month, year)
export const attendanceUpsert = (data: any) => api().attendanceUpsert(data)

export const salaryGetAll = () => api().salaryGetAll()
export const salaryCreate = (data: any) => api().salaryCreate(data)
export const salaryUpdate = (id: string, data: any) => api().salaryUpdate(id, data)
export const salaryMarkPaid = (id: string) => api().salaryMarkPaid(id)

export const payrollGetAll = () => api().payrollGetAll()
export const payrollCreate = (data: any) => api().payrollCreate(data)
export const payrollUpdate = (id: string, data: any) => api().payrollUpdate(id, data)

export const productsGetAll = (): Promise<Product[]> => api().productsGetAll()
export const productsCreate = (data: any) => api().productsCreate(data)
export const productsUpdate = (id: string, data: any) => api().productsUpdate(id, data)
export const productsDelete = (id: string) => api().productsDelete(id)

export const categoriesGetAll = () => api().categoriesGetAll()
export const categoriesCreate = (data: any) => api().categoriesCreate(data)

export const ordersGetAll = () => api().ordersGetAll()
export const ordersGetById = (id: string) => api().ordersGetById(id)
export const ordersCreate = (data: any) => api().ordersCreate(data)
export const ordersUpdate = (id: string, data: any) => api().ordersUpdate(id, data)
export const ordersDelete = (id: string) => api().ordersDelete(id)

export const paymentsGetAll = () => api().paymentsGetAll()
export const paymentsCreate = (data: any) => api().paymentsCreate(data)

export const customersGetAll = () => api().customersGetAll()
export const customersCreate = (data: any) => api().customersCreate(data)
export const customersUpdate = (id: string, data: any) => api().customersUpdate(id, data)
export const customersDelete = (id: string) => api().customersDelete(id)

export const tablesGetAll = () => api().tablesGetAll()
export const tablesCreate = (data: any) => api().tablesCreate(data)
export const tablesUpdate = (id: number, data: any) => api().tablesUpdate(id, data)
export const tablesDelete = (id: number) => api().tablesDelete(id)
export const tablesResetAll = () => api().tablesResetAll()

export const reservationsGetAll = () => api().reservationsGetAll()
export const reservationsCreate = (data: any) => api().reservationsCreate(data)
export const reservationsUpdate = (id: string, data: any) => api().reservationsUpdate(id, data)
export const reservationsDelete = (id: string) => api().reservationsDelete(id)

export const revenueGetAll = () => api().revenueGetAll()
export const revenueCreate = (data: any) => api().revenueCreate(data)
export const revenueDelete = (id: string) => api().revenueDelete(id)

export const expensesGetAll = () => api().expensesGetAll()
export const expensesCreate = (data: any) => api().expensesCreate(data)
export const expensesDelete = (id: string) => api().expensesDelete(id)

export const cogsGetAll = () => api().cogsGetAll()
export const cogsCreate = (data: any) => api().cogsCreate(data)
export const cogsDelete = (id: string) => api().cogsDelete(id)

export const discountsGetAll = () => api().discountsGetAll()
export const discountsCreate = (data: any) => api().discountsCreate(data)

export const expenseCategoriesGetAll = () => api().expenseCategoriesGetAll()
export const expenseCategoriesCreate = (data: any) => api().expenseCategoriesCreate(data)

export const backupCreate = () => api().backupCreate()
export const backupRestore = () => api().backupRestore()
