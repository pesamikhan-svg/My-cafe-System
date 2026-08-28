import { Product } from '@/types'
import { useCartStore } from '@/stores/useCartStore'
import { useProductStore } from '@/stores/useProductStore'
import { formatCurrency } from '@/lib/utils'
import { Plus, Edit2, Trash2 } from 'lucide-react'

interface ProductCardProps {
  product: Product
  onEdit?: (product: Product) => void
}

export default function ProductCard({ product, onEdit }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem)
  const removeProduct = useProductStore((s) => s.removeProduct)

  const handleDelete = () => {
    if (window.confirm(`Delete "${product.name}"?`)) {
      removeProduct(product.id)
    }
  }

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg hover:shadow-accent/5 hover:border-accent/20 transition-all duration-300 overflow-hidden flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50 dark:bg-gray-900 shrink-0">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600">
            <span className="text-4xl font-bold uppercase">{product.name[0]}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit?.(product) }}
            className="w-10 h-10 rounded-xl bg-white/90 dark:bg-gray-800/90 shadow-sm flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-colors"
          >
            <Edit2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete() }}
            className="w-10 h-10 rounded-xl bg-white/90 dark:bg-gray-800/90 shadow-sm flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
          >
            <Trash2 className="w-5 h-5 text-red-500" />
          </button>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1 justify-between gap-2">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate leading-snug">
          {product.name}
        </h3>
        {product.sizes && product.sizes.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.sizes.map((s) => (
              <span key={s} className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-500 dark:text-gray-400">
                {s}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <span className="text-accent font-bold text-base block">
              {formatCurrency(product.price)}
            </span>
            {product.stock !== undefined && (
              <span className={`text-xs ${product.stock <= 5 ? 'text-red-500 font-semibold' : 'text-gray-500'}`}>
                Stock: {product.stock}
              </span>
            )}
          </div>
          <button
            onClick={() => addItem(product)}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent text-white hover:bg-accent-hover active:scale-90 transition-all duration-200 shadow-sm shadow-accent/20"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
