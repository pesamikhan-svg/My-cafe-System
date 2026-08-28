import { useCartStore } from '@/stores/useCartStore'
import CartItemRow from './CartItem'
import OrderSummary from './OrderSummary'
import ActionButtons from './ActionButtons'
import { ShoppingBag } from 'lucide-react'

export default function OrderPanel() {
  const items = useCartStore((s) => s.items)

  return (
    <div className="h-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg flex flex-col overflow-hidden">
      <div className="px-4 py-3.5 border-b border-gray-100 dark:border-gray-700 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent/10">
              <ShoppingBag className="w-4 h-4 text-accent" />
            </div>
            <h2 className="font-semibold text-gray-900 dark:text-white">Current Order</h2>
          </div>
          <span className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-lg font-medium">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 min-h-0 scroll-smooth">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-16 text-gray-400">
            <ShoppingBag className="w-12 h-12 mb-3 text-gray-300 dark:text-gray-600" />
            <p className="text-sm font-medium">Order is empty</p>
            <p className="text-xs mt-1">Select items from the menu</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {items.map((item) => (
              <CartItemRow key={item.product.id} item={item} />
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-gray-100 dark:border-gray-700 shrink-0">
        <OrderSummary />
        <ActionButtons />
      </div>
    </div>
  )
}
