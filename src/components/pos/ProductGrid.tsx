import { useMemo } from 'react'
import { usePOSStore } from '@/stores/useCartStore'
import { useProductStore } from '@/stores/useProductStore'
import ProductCard from './ProductCard'
import type { Product } from '@/types'

interface ProductGridProps {
  onEdit?: (product: Product) => void
}

export default function ProductGrid({ onEdit }: ProductGridProps) {
  const { activeCategory, searchQuery } = usePOSStore()
  const products = useProductStore((s) => s.products)

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = activeCategory === 'all' || p.category === activeCategory
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase())
      return matchCategory && matchSearch
    })
  }, [activeCategory, searchQuery, products])

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-fr">
      {filtered.map((product) => (
        <ProductCard key={product.id} product={product} onEdit={onEdit} />
      ))}
      {filtered.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-400">
          <p className="text-lg font-medium">No items found</p>
          <p className="text-sm">Try a different category or search term</p>
        </div>
      )}
    </div>
  )
}
