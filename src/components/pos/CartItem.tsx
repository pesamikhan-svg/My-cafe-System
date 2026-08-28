import { CartItem as CartItemType } from '@/types'
import { useCartStore } from '@/stores/useCartStore'
import { formatCurrency } from '@/lib/utils'
import { Minus, Plus, Trash2 } from 'lucide-react'

interface CartItemProps {
  item: CartItemType
}

export default function CartItemRow({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore()

  return (
    <div className="flex items-center gap-3 py-3 group">
      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0 flex items-center justify-center text-gray-400 text-xs font-bold">
        {item.product.image ? (
          <img
            src={item.product.image}
            alt={item.product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{item.product.name[0]}</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate leading-snug">
          {item.product.name}
        </p>
        <p className="text-[11px] text-gray-400 mt-0.5">
          {formatCurrency(item.product.price)} each
        </p>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-accent transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-8 text-center text-sm font-semibold text-gray-900 dark:text-white">
          {item.quantity}
        </span>
        <button
          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-accent transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="text-right min-w-[75px] shrink-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">
          {formatCurrency(item.product.price * item.quantity)}
        </p>
      </div>

      <button
        onClick={() => removeItem(item.product.id)}
        className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-200 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all shrink-0"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}
