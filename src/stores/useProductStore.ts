import { create } from 'zustand'
import { Product, Category } from '@/types'
import * as db from '@/lib/db-api'

interface ProductStore {
  products: Product[]
  categories: Category[]
  loading: boolean
  init: () => Promise<void>
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>
  removeProduct: (id: string) => Promise<void>
  updateProduct: (id: string, data: Partial<Product>) => Promise<void>
  addCategory: (name: string, icon?: string) => Promise<void>
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  categories: [],
  loading: true,

  init: async () => {
    const [products, categories] = await Promise.all([
      db.productsGetAll(),
      db.categoriesGetAll(),
    ])
    set({ products, categories, loading: false })
  },

  addProduct: async (product) => {
    const created = await db.productsCreate(product)
    set((state) => ({ products: [...state.products, created] }))
  },

  removeProduct: async (id) => {
    await db.productsDelete(id)
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, available: false } : p
      ),
    }))
  },

  updateProduct: async (id, data) => {
    const updated = await db.productsUpdate(id, data)
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, ...updated } : p)),
    }))
  },

  addCategory: async (name, icon = 'grid') => {
    const existing = get().categories.find((c) => c.name === name)
    if (existing) return
    const id = name.toLowerCase().replace(/\s+/g, '-')
    const created = await db.categoriesCreate({ id, name, icon })
    set((state) => ({ categories: [...state.categories, created] }))
  },
}))
