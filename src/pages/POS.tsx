import { useState } from 'react'
import { usePOSStore } from '@/stores/useCartStore'
import CategoryTabs from '@/components/pos/CategoryTabs'
import ProductGrid from '@/components/pos/ProductGrid'
import OrderPanel from '@/components/pos/OrderPanel'
import AddProductModal from '@/components/pos/AddProductModal'
import { Search, Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { Product } from '@/types'

export default function POS() {
  const { searchQuery, setSearchQuery } = usePOSStore()
  const [showAddModal, setShowAddModal] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)

  return (
    <div className="flex gap-6 flex-1 min-h-0 p-6 overflow-hidden">
      <div className="flex-1 min-w-0 flex flex-col gap-5 overflow-y-auto scroll-smooth">
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search menu items..."
              className="pl-11 h-12 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus-visible:ring-1 focus-visible:ring-accent text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => { setEditProduct(null); setShowAddModal(true) }} className="gap-1.5 shrink-0 h-12 px-5 text-base">
            <Plus className="w-5 h-5" />
            Add Product
          </Button>
        </div>

        <AddProductModal open={showAddModal} onClose={() => { setShowAddModal(false); setEditProduct(null) }} editProduct={editProduct} />
        <div className="shrink-0">
          <CategoryTabs />
        </div>
        <div className="flex-1 min-h-0 pb-2">
          <ProductGrid onEdit={(p) => { setEditProduct(p); setShowAddModal(true) }} />
        </div>
      </div>

      <div className="w-[420px] shrink-0">
        <OrderPanel />
      </div>
    </div>
  )
}
