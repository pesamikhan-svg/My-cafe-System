import { app, BrowserWindow, ipcMain, dialog, protocol, net } from 'electron'
import path from 'path'
import fs from 'fs'
import { createRequire } from 'module'
const _require = createRequire(import.meta.url)

const isDev = !app.isPackaged
const dbDir = isDev ? path.join(app.getAppPath(), 'prisma') : path.join(app.getPath('userData'), 'prisma')
const dbPath = path.join(dbDir, 'cafe.db')

if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true })
if (!isDev && !fs.existsSync(dbPath)) {
  const bundledDb = path.join(app.getAppPath(), 'prisma', 'cafe.db')
  if (fs.existsSync(bundledDb)) fs.copyFileSync(bundledDb, dbPath)
}

process.env.DATABASE_URL = 'file:' + dbPath

const prismaDir = isDev
  ? path.join(app.getAppPath(), 'prisma', 'generated-client')
  : path.join(app.getAppPath(), 'prisma', 'generated-client')
let prisma: any
try {
  const { PrismaClient } = _require(prismaDir)
  prisma = new PrismaClient()
} catch (e) {
  console.error('Failed to initialize PrismaClient:', e)
  throw e
}

let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1280,
    minHeight: 800,
    frame: true,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false,
    },
  })

  mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`[Renderer Console] (${level}) ${message} at ${sourceId}:${line}`)
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadURL(`${PROTOCOL}://./index.html`)
    mainWindow.webContents.openDevTools()
  }

  mainWindow.webContents.on('did-fail-load', (_e, code, desc) => {
    console.error('Renderer failed to load:', code, desc)
  })
  mainWindow.webContents.on('unresponsive', () => {
    console.error('Renderer became unresponsive')
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// ─── IPC Handlers ───────────────────────────────────────────────────────────

function registerHandlers() {

  // App Meta
  ipcMain.handle('meta:get', async (_e, id: string) => {
    const row = await prisma.appMeta.findUnique({ where: { id } })
    return row?.value ?? null
  })
  ipcMain.handle('meta:set', async (_e, id: string, value: string) => {
    await prisma.appMeta.upsert({ where: { id }, update: { value }, create: { id, value } })
  })

  // Staff
  ipcMain.handle('staff:getAll', async () => prisma.staff.findMany({ orderBy: { createdAt: 'desc' } }))
  ipcMain.handle('staff:getById', async (_e, id: string) => prisma.staff.findUnique({ where: { id } }))
  ipcMain.handle('staff:create', async (_e, data: any) => prisma.staff.create({ data }))
  ipcMain.handle('staff:update', async (_e, id: string, data: any) => prisma.staff.update({ where: { id }, data }))
  ipcMain.handle('staff:delete', async (_e, id: string) => prisma.staff.update({ where: { id }, data: { isActive: false } }))

  // Attendance
  ipcMain.handle('attendance:getByStaff', async (_e, staffId: string, month: number, year: number) => {
    const start = new Date(year, month - 1, 1)
    const end = new Date(year, month, 0, 23, 59, 59)
    return prisma.attendance.findMany({
      where: { staffId, date: { gte: start, lte: end } },
      orderBy: { date: 'asc' },
    })
  })
  ipcMain.handle('attendance:upsert', async (_e, data: any) => {
    const existing = await prisma.attendance.findFirst({
      where: { staffId: data.staffId, date: new Date(data.date) },
    })
    if (existing) {
      return prisma.attendance.update({ where: { id: existing.id }, data })
    }
    return prisma.attendance.create({ data: { ...data, date: new Date(data.date) } })
  })

  // Salary
  ipcMain.handle('salary:getAll', async () => prisma.salaryRecord.findMany({ orderBy: [{ year: 'desc' }, { month: 'desc' }] }))
  ipcMain.handle('salary:create', async (_e, data: any) => prisma.salaryRecord.create({ data }))
  ipcMain.handle('salary:update', async (_e, id: string, data: any) => prisma.salaryRecord.update({ where: { id }, data }))
  ipcMain.handle('salary:markPaid', async (_e, id: string) =>
    prisma.salaryRecord.update({ where: { id }, data: { paid: true, paidDate: new Date() } }))

  // Payroll
  ipcMain.handle('payroll:getAll', async () => prisma.payroll.findMany({ orderBy: { createdAt: 'desc' } }))
  ipcMain.handle('payroll:create', async (_e, data: any) => prisma.payroll.create({ data }))
  ipcMain.handle('payroll:update', async (_e, id: string, data: any) => prisma.payroll.update({ where: { id }, data }))

  // Products
  ipcMain.handle('products:getAll', async () => {
    const products = await prisma.product.findMany({ orderBy: { name: 'asc' } })
    return products.map((p: any) => ({ ...p, sizes: p.sizes ? JSON.parse(p.sizes) : undefined }))
  })
  ipcMain.handle('products:create', async (_e, data: any) => {
    const dbData = { ...data, sizes: data.sizes ? JSON.stringify(data.sizes) : null }
    const created = await prisma.product.create({ data: dbData })
    return { ...created, sizes: created.sizes ? JSON.parse(created.sizes) : undefined }
  })
  ipcMain.handle('products:update', async (_e, id: string, data: any) => {
    const dbData = { ...data, sizes: data.sizes ? JSON.stringify(data.sizes) : data.sizes === undefined ? undefined : null }
    const updated = await prisma.product.update({ where: { id }, data: dbData })
    return { ...updated, sizes: updated.sizes ? JSON.parse(updated.sizes) : undefined }
  })
  ipcMain.handle('products:delete', async (_e, id: string) => prisma.product.update({ where: { id }, data: { available: false } }))

  // Categories
  ipcMain.handle('categories:getAll', async () => prisma.category.findMany({ orderBy: { name: 'asc' } }))
  ipcMain.handle('categories:create', async (_e, data: any) => prisma.category.create({ data }))

  // Orders
  ipcMain.handle('orders:getAll', async () => prisma.order.findMany({ orderBy: { createdAt: 'desc' }, include: { items: true, payments: true } }))
  ipcMain.handle('orders:getById', async (_e, id: string) =>
    prisma.order.findUnique({ where: { id }, include: { items: true, payments: true } }))
  ipcMain.handle('orders:create', async (_e, data: any) => {
    const { items, ...orderData } = data
    const counter = await prisma.appMeta.findUnique({ where: { id: 'invoiceCounter' } })
    const nextNum = counter ? parseInt(counter.value) + 1 : 1
    await prisma.appMeta.upsert({ where: { id: 'invoiceCounter' }, update: { value: String(nextNum) }, create: { id: 'invoiceCounter', value: '1' } })
    const invoiceNumber = `INV-${String(nextNum).padStart(4, '0')}`
    const order = await prisma.order.create({
      data: {
        ...orderData,
        invoiceNumber,
        createdAt: new Date(),
        items: { create: items },
      },
      include: { items: true, payments: true },
    })
    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } })
      if (product && product.stock > 0) {
        await prisma.product.update({ where: { id: item.productId }, data: { stock: Math.max(0, product.stock - item.quantity) } })
      }
    }
    return order
  })
  ipcMain.handle('orders:update', async (_e, id: string, data: any) => prisma.order.update({ where: { id }, data }))
  ipcMain.handle('orders:delete', async (_e, id: string) => prisma.order.delete({ where: { id } }))

  // Payments
  ipcMain.handle('payments:getAll', async () => prisma.payment.findMany({ orderBy: { createdAt: 'desc' }, include: { order: true } }))
  ipcMain.handle('payments:create', async (_e, data: any) => prisma.payment.create({ data }))

  // Customers
  ipcMain.handle('customers:getAll', async () => prisma.customer.findMany({ orderBy: { totalOrders: 'desc' } }))
  ipcMain.handle('customers:create', async (_e, data: any) => prisma.customer.create({ data }))
  ipcMain.handle('customers:update', async (_e, id: string, data: any) => prisma.customer.update({ where: { id }, data }))
  ipcMain.handle('customers:delete', async (_e, id: string) => prisma.customer.delete({ where: { id } }))

  // Tables
  ipcMain.handle('tables:getAll', async () => prisma.table.findMany({ orderBy: { id: 'asc' } }))
  ipcMain.handle('tables:create', async (_e, data: any) => prisma.table.create({ data }))
  ipcMain.handle('tables:update', async (_e, id: number, data: any) => prisma.table.update({ where: { id }, data }))
  ipcMain.handle('tables:delete', async (_e, id: number) => prisma.table.delete({ where: { id } }))
  ipcMain.handle('tables:resetAll', async () => {
    const tables = await prisma.table.findMany()
    for (const t of tables) {
      await prisma.table.update({ where: { id: t.id }, data: { status: 'available', server: null } })
    }
    return prisma.table.findMany({ orderBy: { id: 'asc' } })
  })

  // Reservations
  ipcMain.handle('reservations:getAll', async () => prisma.reservation.findMany({ orderBy: { createdAt: 'desc' } }))
  ipcMain.handle('reservations:create', async (_e, data: any) => prisma.reservation.create({ data }))
  ipcMain.handle('reservations:update', async (_e, id: string, data: any) => prisma.reservation.update({ where: { id }, data }))
  ipcMain.handle('reservations:delete', async (_e, id: string) => prisma.reservation.delete({ where: { id } }))

  // Profit & Loss
  ipcMain.handle('revenue:getAll', async () => prisma.revenueEntry.findMany({ orderBy: { date: 'desc' } }))
  ipcMain.handle('revenue:create', async (_e, data: any) => prisma.revenueEntry.create({ data: { ...data, date: new Date(data.date) } }))
  ipcMain.handle('revenue:delete', async (_e, id: string) => prisma.revenueEntry.delete({ where: { id } }))

  ipcMain.handle('expenses:getAll', async () => prisma.expenseEntry.findMany({ orderBy: { date: 'desc' } }))
  ipcMain.handle('expenses:create', async (_e, data: any) => prisma.expenseEntry.create({ data: { ...data, date: new Date(data.date) } }))
  ipcMain.handle('expenses:delete', async (_e, id: string) => prisma.expenseEntry.delete({ where: { id } }))

  ipcMain.handle('cogs:getAll', async () => prisma.cOGSEntry.findMany({ orderBy: { date: 'desc' } }))
  ipcMain.handle('cogs:create', async (_e, data: any) => prisma.cOGSEntry.create({ data: { ...data, date: new Date(data.date) } }))
  ipcMain.handle('cogs:delete', async (_e, id: string) => prisma.cOGSEntry.delete({ where: { id } }))

  ipcMain.handle('discounts:getAll', async () => prisma.discountEntry.findMany({ orderBy: { date: 'desc' } }))
  ipcMain.handle('discounts:create', async (_e, data: any) => prisma.discountEntry.create({ data: { ...data, date: new Date(data.date) } }))

  ipcMain.handle('expenseCategories:getAll', async () => prisma.expenseCategory.findMany())
  ipcMain.handle('expenseCategories:create', async (_e, data: any) => prisma.expenseCategory.create({ data }))
}

// ─── Seed minimal accounts ──────────────────────────────────────────────────

async function seedEssential() {
  const existing = await prisma.appMeta.findUnique({ where: { id: 'seed:users' } })
  if (existing?.value === 'true') return

  await prisma.staff.create({
    data: {
      id: 's-admin',
      staffId: 'ADMIN-001',
      fullName: 'Admin User',
      email: 'admin@cafe.com',
      phone: '+1 555-0001',
      cnic: 'CNIC-ADMIN',
      address: 'Cafe POS Headquarters',
      joiningDate: new Date(),
      position: 'Manager',
      basicSalary: 0,
      isAdmin: true,
      isActive: true,
      role: 'admin',
    },
  })

  await prisma.staff.create({
    data: {
      id: 's-cashier',
      staffId: 'CASHIER-001',
      fullName: 'Cashier User',
      email: 'cashier@cafe.com',
      phone: '+1 555-0002',
      cnic: 'CNIC-CASHIER',
      address: 'Cafe POS Headquarters',
      joiningDate: new Date(),
      position: 'Cashier',
      basicSalary: 0,
      isAdmin: false,
      isActive: true,
      role: 'cashier',
    },
  })

  const catCount = await prisma.category.count()
  if (catCount === 0) {
    const defaultCategories = [
      { id: 'coffee', name: 'Coffee', icon: 'coffee' },
      { id: 'tea', name: 'Tea', icon: 'glass-water' },
      { id: 'cold-drinks', name: 'Cold Drinks', icon: 'wine' },
      { id: 'desserts', name: 'Desserts', icon: 'cake' },
      { id: 'snacks', name: 'Snacks', icon: 'cookie' },
    ]
    for (const cat of defaultCategories) {
      await prisma.category.create({ data: cat })
    }
  }

  await prisma.appMeta.create({ data: { id: 'seed:users', value: 'true' } })
}

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err)
})
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason)
})

// ─── Custom Protocol ────────────────────────────────────────────────────────

const PROTOCOL = 'cafe-app'

if (!isDev) {
  protocol.registerSchemesAsPrivileged([
    {
      scheme: PROTOCOL,
      privileges: { secure: true, standard: true, supportFetchAPI: true, bypassCSP: true, stream: true },
    },
  ])
}

// ─── App Lifecycle ──────────────────────────────────────────────────────────

app.whenReady().then(async () => {
  try { await seedEssential() } catch (e) { console.error('seedEssential failed:', e) }

  if (!isDev) {
    protocol.handle(PROTOCOL, (request) => {
      const url = new URL(request.url)
      let pathname = url.pathname
      if (pathname === '/' || pathname === '') pathname = '/index.html'
      const filePath = path.join(__dirname, '../dist', pathname)
      return net.fetch('file:///' + filePath.replace(/\\/g, '/'))
    })
  }

  registerHandlers()
  createWindow()
}).catch((e) => {
  console.error('App failed to start:', e)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

ipcMain.handle('get-app-path', () => {
  return app.getPath('userData')
})

ipcMain.handle('backup:create', async () => {
  if (!fs.existsSync(dbPath)) throw new Error('Database file not found')
  const result = await dialog.showSaveDialog(mainWindow!, {
    defaultPath: `cafe-backup-${new Date().toISOString().split('T')[0]}.db`,
    filters: [{ name: 'SQLite Database', extensions: ['db'] }],
  })
  if (result.canceled || !result.filePath) return false
  fs.copyFileSync(dbPath, result.filePath)
  return true
})

ipcMain.handle('backup:restore', async () => {
  const result = await dialog.showOpenDialog(mainWindow!, {
    filters: [{ name: 'SQLite Database', extensions: ['db'] }],
    properties: ['openFile'],
  })
  if (result.canceled || result.filePaths.length === 0) return false
  await prisma.$disconnect()
  fs.copyFileSync(result.filePaths[0], dbPath)
  return true
})
