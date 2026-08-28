import { useCartStore } from '@/stores/useCartStore'
import { formatCurrency } from '@/lib/utils'

export default function OrderSummary() {
  const { getSubtotal, getTax, getServiceCharge, getTotal } = useCartStore()

  const subtotal = getSubtotal()
  const tax = getTax()
  const serviceCharge = getServiceCharge()
  const total = getTotal()

  return (
    <div className="px-4 pt-3 pb-2 space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">Subtotal</span>
        <span className="font-medium text-gray-700 dark:text-gray-200">
          {formatCurrency(subtotal)}
        </span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">Discount</span>
        <span className="font-medium text-green-600">$0.00</span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">Tax (8%)</span>
        <span className="font-medium text-gray-700 dark:text-gray-200">
          {formatCurrency(tax)}
        </span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">Service Charge (5%)</span>
        <span className="font-medium text-gray-700 dark:text-gray-200">
          {formatCurrency(serviceCharge)}
        </span>
      </div>
      <div className="border-t border-gray-100 dark:border-gray-700 my-2" />
      <div className="flex items-center justify-between pt-1">
        <span className="text-sm font-bold text-gray-900 dark:text-white">Grand Total</span>
        <span className="text-lg font-bold text-accent">
          {formatCurrency(total)}
        </span>
      </div>
    </div>
  )
}
