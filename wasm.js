
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('@prisma/client/runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  Serializable: 'Serializable'
});

exports.Prisma.AppMetaScalarFieldEnum = {
  id: 'id',
  value: 'value'
};

exports.Prisma.ProductScalarFieldEnum = {
  id: 'id',
  name: 'name',
  price: 'price',
  category: 'category',
  image: 'image',
  description: 'description',
  available: 'available',
  sizes: 'sizes',
  stock: 'stock',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CategoryScalarFieldEnum = {
  id: 'id',
  name: 'name',
  icon: 'icon'
};

exports.Prisma.OrderScalarFieldEnum = {
  id: 'id',
  invoiceNumber: 'invoiceNumber',
  tableNumber: 'tableNumber',
  customerName: 'customerName',
  customerId: 'customerId',
  subtotal: 'subtotal',
  discount: 'discount',
  tax: 'tax',
  serviceCharge: 'serviceCharge',
  total: 'total',
  status: 'status',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.OrderItemScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  productId: 'productId',
  productName: 'productName',
  productPrice: 'productPrice',
  quantity: 'quantity',
  notes: 'notes'
};

exports.Prisma.CustomerScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  phone: 'phone',
  totalOrders: 'totalOrders',
  totalSpent: 'totalSpent',
  createdAt: 'createdAt'
};

exports.Prisma.TableScalarFieldEnum = {
  id: 'id',
  seats: 'seats',
  status: 'status',
  server: 'server'
};

exports.Prisma.ReservationScalarFieldEnum = {
  id: 'id',
  name: 'name',
  guests: 'guests',
  time: 'time',
  date: 'date',
  status: 'status',
  phone: 'phone',
  tableId: 'tableId',
  createdAt: 'createdAt'
};

exports.Prisma.PaymentScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  amount: 'amount',
  method: 'method',
  status: 'status',
  createdAt: 'createdAt'
};

exports.Prisma.StaffScalarFieldEnum = {
  id: 'id',
  staffId: 'staffId',
  fullName: 'fullName',
  email: 'email',
  phone: 'phone',
  cnic: 'cnic',
  address: 'address',
  joiningDate: 'joiningDate',
  position: 'position',
  basicSalary: 'basicSalary',
  profilePhoto: 'profilePhoto',
  isAdmin: 'isAdmin',
  isActive: 'isActive',
  role: 'role',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AttendanceScalarFieldEnum = {
  id: 'id',
  staffId: 'staffId',
  date: 'date',
  checkIn: 'checkIn',
  checkOut: 'checkOut',
  status: 'status',
  hoursWorked: 'hoursWorked',
  notes: 'notes',
  createdAt: 'createdAt'
};

exports.Prisma.SalaryRecordScalarFieldEnum = {
  id: 'id',
  staffId: 'staffId',
  month: 'month',
  year: 'year',
  basicSalary: 'basicSalary',
  overtimeHours: 'overtimeHours',
  overtimeRate: 'overtimeRate',
  overtimePay: 'overtimePay',
  bonuses: 'bonuses',
  allowances: 'allowances',
  deductions: 'deductions',
  advanceDeduction: 'advanceDeduction',
  latePenalties: 'latePenalties',
  totalSalary: 'totalSalary',
  paid: 'paid',
  paidDate: 'paidDate',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PayrollScalarFieldEnum = {
  id: 'id',
  staffId: 'staffId',
  month: 'month',
  year: 'year',
  generatedDate: 'generatedDate',
  totalSalaries: 'totalSalaries',
  status: 'status',
  createdAt: 'createdAt'
};

exports.Prisma.RevenueEntryScalarFieldEnum = {
  id: 'id',
  date: 'date',
  amount: 'amount',
  source: 'source',
  notes: 'notes',
  createdAt: 'createdAt'
};

exports.Prisma.ExpenseEntryScalarFieldEnum = {
  id: 'id',
  date: 'date',
  amount: 'amount',
  category: 'category',
  description: 'description',
  isSalary: 'isSalary',
  notes: 'notes',
  createdAt: 'createdAt'
};

exports.Prisma.COGSEntryScalarFieldEnum = {
  id: 'id',
  date: 'date',
  productName: 'productName',
  quantity: 'quantity',
  unit: 'unit',
  unitCost: 'unitCost',
  totalCost: 'totalCost',
  notes: 'notes',
  createdAt: 'createdAt'
};

exports.Prisma.DiscountEntryScalarFieldEnum = {
  id: 'id',
  date: 'date',
  amount: 'amount',
  reason: 'reason',
  createdAt: 'createdAt'
};

exports.Prisma.ExpenseCategoryScalarFieldEnum = {
  id: 'id',
  name: 'name',
  icon: 'icon',
  budget: 'budget'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  AppMeta: 'AppMeta',
  Product: 'Product',
  Category: 'Category',
  Order: 'Order',
  OrderItem: 'OrderItem',
  Customer: 'Customer',
  Table: 'Table',
  Reservation: 'Reservation',
  Payment: 'Payment',
  Staff: 'Staff',
  Attendance: 'Attendance',
  SalaryRecord: 'SalaryRecord',
  Payroll: 'Payroll',
  RevenueEntry: 'RevenueEntry',
  ExpenseEntry: 'ExpenseEntry',
  COGSEntry: 'COGSEntry',
  DiscountEntry: 'DiscountEntry',
  ExpenseCategory: 'ExpenseCategory'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
