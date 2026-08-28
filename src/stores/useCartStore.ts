import { create } from 'zustand'
import { Product, CartItem, Order } from '@/types'
import * as db from '@/lib/db-api'

interface CartStore {
  items: CartItem[]
  customerName: string
  customerId: string | null
  tableNumber: number | null
  notes: string
  submitting: boolean
  lastOrder: Order | null

  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  setCustomerName: (name: string) => void
  setCustomerId: (id: string | null) => void
  setTableNumber: (table: number | null) => void
  setNotes: (notes: string) => void
  getSubtotal: () => number
  getTax: () => number
  getServiceCharge: () => number
  getTotal: () => number
  submitOrder: (paymentMethod: string) => Promise<Order | null>
  saveDraft: () => Promise<Order | null>
  holdOrder: () => Promise<Order | null>
}

function buildItemPayload(state: CartStore) {
  const subtotal = state.getSubtotal()
  const tax = state.getTax()
  const serviceCharge = state.getServiceCharge()
  const total = state.getTotal()
  return {
    tableNumber: state.tableNumber,
    customerName: state.customerName || null,
    customerId: state.customerId || null,
    subtotal: Math.round(subtotal * 100) / 100,
    discount: 0,
    tax: Math.round(tax * 100) / 100,
    serviceCharge: Math.round(serviceCharge * 100) / 100,
    total: Math.round(total * 100) / 100,
    notes: state.notes || null,
    items: state.items.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      productPrice: item.product.price,
      quantity: item.quantity,
      notes: item.notes || null,
    })),
  }
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  customerName: '',
  customerId: null,
  tableNumber: null,
  notes: '',
  submitting: false,
  lastOrder: null,

  addItem: (product: Product) => {
    set((state) => {
      const existing = state.items.find((item) => item.product.id === product.id)
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        }
      }
      return { items: [...state.items, { product, quantity: 1 }] }
    })
  },

  removeItem: (productId: string) => {
    set((state) => ({
      items: state.items.filter((item) => item.product.id !== productId),
    }))
  },

  updateQuantity: (productId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(productId)
      return
    }
    set((state) => ({
      items: state.items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      ),
    }))
  },

  clearCart: () => set({ items: [], customerName: '', customerId: null, tableNumber: null, notes: '' }),

  setCustomerName: (name) => set({ customerName: name }),
  setCustomerId: (id) => set({ customerId: id }),
  setTableNumber: (table) => set({ tableNumber: table }),
  setNotes: (notes) => set({ notes }),

  getSubtotal: () => {
    return get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  },

  getTax: () => {
    return get().getSubtotal() * 0.08
  },

  getServiceCharge: () => {
    return get().getSubtotal() * 0.05
  },

  getTotal: () => {
    const state = get()
    return state.getSubtotal() + state.getTax() + state.getServiceCharge()
  },

  submitOrder: async (paymentMethod: string) => {
    const state = get()
    if (state.items.length === 0 || state.submitting) return null

    set({ submitting: true })
    try {
      const orderData = {
        ...buildItemPayload(state),
        status: 'completed',
      }

      const order = await db.ordersCreate(orderData) as any

      await db.paymentsCreate({
        orderId: order.id,
        amount: orderData.total,
        method: paymentMethod,
        status: 'completed',
        createdAt: new Date(),
      })

      // Record revenue automatically
      await db.revenueCreate({
        date: new Date().toISOString().split('T')[0],
        amount: orderData.total,
        source: paymentMethod === 'cash' ? 'Dine-in' : paymentMethod === 'card' ? 'Takeaway' : 'Delivery',
      })

      if (state.tableNumber) {
        await db.tablesUpdate(state.tableNumber, { status: 'occupied' })
      }

      if (state.customerId) {
        const customers = await db.customersGetAll()
        const customer = customers.find((c: any) => c.id === state.customerId)
        if (customer) {
          await db.customersUpdate(state.customerId, {
            totalOrders: (customer.totalOrders || 0) + 1,
            totalSpent: Math.round(((customer.totalSpent || 0) + orderData.total) * 100) / 100,
          })
        }
      }

      set({ lastOrder: order as unknown as Order })
      state.clearCart()
      return order as unknown as Order
    } finally {
      set({ submitting: false })
    }
  },

  saveDraft: async () => {
    const state = get()
    if (state.items.length === 0 || state.submitting) return null
    set({ submitting: true })
    try {
      const orderData = {
        ...buildItemPayload(state),
        status: 'draft',
      }
      const order = await db.ordersCreate(orderData) as any
      set({ lastOrder: order as unknown as Order })
      state.clearCart()
      return order as unknown as Order
    } finally {
      set({ submitting: false })
    }
  },

  holdOrder: async () => {
    const state = get()
    if (state.items.length === 0 || state.submitting) return null
    set({ submitting: true })
    try {
      const orderData = {
        ...buildItemPayload(state),
        status: 'held',
      }
      const order = await db.ordersCreate(orderData) as any
      set({ lastOrder: order as unknown as Order })
      state.clearCart()
      return order as unknown as Order
    } finally {
      set({ submitting: false })
    }
  },
}))

export const usePOSStore = create<{
  activeCategory: string
  searchQuery: string
  setActiveCategory: (category: string) => void
  setSearchQuery: (query: string) => void
}>((set) => ({
  activeCategory: 'all',
  searchQuery: '',
  setActiveCategory: (category) => set({ activeCategory: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}))
