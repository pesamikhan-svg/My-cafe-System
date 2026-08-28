import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Printer, Receipt, Pause, Save, CreditCard, X, Check, Loader2 } from 'lucide-react'
import { useCartStore } from '@/stores/useCartStore'
import { printBill, printKOT } from '@/lib/print'

const paymentMethods = [
  { id: 'cash', label: 'Cash', icon: '💵' },
  { id: 'card', label: 'Credit Card', icon: '💳' },
  { id: 'mobile', label: 'Mobile Payment', icon: '📱' },
  { id: 'wallet', label: 'Digital Wallet', icon: '🔷' },
]

export default function ActionButtons() {
  const [showPayment, setShowPayment] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const {
    items, getTotal, getSubtotal, getTax, getServiceCharge,
    submitOrder, saveDraft, holdOrder,
    lastOrder, submitting,
  } = useCartStore()

  const handlePayment = async () => {
    if (!selectedMethod) return
    const order = await submitOrder(selectedMethod)
    if (order) {
      printBill(order)
    }
    setShowPayment(false)
    setSelectedMethod(null)
  }

  const handlePrintKOT = () => {
    if (items.length === 0) return
    const total = getTotal()
    const order = {
      id: 'temp-' + Date.now().toString(36),
      items: items.map(i => ({ ...i, product: { ...i.product } })),
      subtotal: getSubtotal(),
      discount: 0,
      tax: getTax(),
      serviceCharge: getServiceCharge(),
      total,
      status: 'pending' as const,
      createdAt: new Date(),
    }
    printKOT(order as any)
  }

  const handlePrintBill = async () => {
    if (items.length === 0) return
    if (lastOrder) {
      printBill(lastOrder)
    } else {
      // no completed order yet, pay first or use temp for pre-print
      const total = getTotal()
      const order = {
        id: 'temp-' + Date.now().toString(36),
        items: items.map(i => ({ ...i, product: { ...i.product } })),
        subtotal: getSubtotal(),
        discount: 0,
        tax: getTax(),
        serviceCharge: getServiceCharge(),
        total,
        status: 'pending' as const,
        createdAt: new Date(),
      }
      printBill(order as any)
    }
  }

  const handleHold = async () => {
    await holdOrder()
  }

  const handleSaveDraft = async () => {
    await saveDraft()
  }

  const total = getTotal()

  return (
    <>
      <div className="px-4 pb-3 pt-2 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline" size="default" className="gap-1.5 h-11 text-sm px-3"
            disabled={items.length === 0}
            onClick={handlePrintKOT}
          >
            <Printer className="w-4 h-4 shrink-0" />
            <span className="truncate">Print KOT</span>
          </Button>
          <Button
            variant="outline" size="default" className="gap-1.5 h-11 text-sm px-3"
            disabled={items.length === 0}
            onClick={handlePrintBill}
          >
            <Receipt className="w-4 h-4 shrink-0" />
            <span className="truncate">Print Bill</span>
          </Button>
          <Button
            variant="outline" size="default" className="gap-1.5 h-11 text-sm px-3"
            disabled={items.length === 0}
            onClick={handleHold}
          >
            <Pause className="w-4 h-4 shrink-0" />
            <span className="truncate">Hold Order</span>
          </Button>
          <Button
            variant="outline" size="default" className="gap-1.5 h-11 text-sm px-3"
            disabled={items.length === 0}
            onClick={handleSaveDraft}
          >
            <Save className="w-4 h-4 shrink-0" />
            <span className="truncate">Save Draft</span>
          </Button>
        </div>
        <Button
          size="lg"
          className="w-full gap-2 h-12 text-base font-semibold shadow-lg shadow-accent/25"
          disabled={items.length === 0}
          onClick={() => setShowPayment(true)}
        >
          <CreditCard className="w-5 h-5 shrink-0" />
          Proceed to Payment
        </Button>
      </div>

      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Select Payment</h2>
              <button onClick={() => { setShowPayment(false); setSelectedMethod(null) }} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-500 text-sm">Total Amount</span>
                <span className="text-xl font-bold text-accent">${total.toFixed(2)}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {paymentMethods.map((pm) => (
                  <button
                    key={pm.id}
                    onClick={() => setSelectedMethod(pm.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      selectedMethod === pm.id
                        ? 'border-accent bg-accent/5'
                        : 'border-gray-200 dark:border-gray-700 hover:border-accent/50'
                    }`}
                  >
                    <span className="text-2xl">{pm.icon}</span>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{pm.label}</span>
                    {selectedMethod === pm.id && <Check className="w-4 h-4 text-accent" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-gray-700">
              <Button
                className="w-full gap-2 h-11"
                disabled={!selectedMethod || submitting}
                onClick={handlePayment}
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                {submitting ? 'Processing...' : `Pay $${total.toFixed(2)}`}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
