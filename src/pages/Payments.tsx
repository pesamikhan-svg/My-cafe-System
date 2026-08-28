import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CreditCard, Banknote, Smartphone, Wallet, DollarSign } from 'lucide-react'
import * as db from '@/lib/db-api'
import { formatCurrency } from '@/lib/utils'

const methodIcons: Record<string, React.ElementType> = {
  card: CreditCard,
  cash: Banknote,
  mobile: Smartphone,
  wallet: Wallet,
}

const methodNames: Record<string, string> = {
  card: 'Credit Card',
  cash: 'Cash',
  mobile: 'Mobile Payment',
  wallet: 'Digital Wallet',
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    db.paymentsGetAll().then((data) => {
      setPayments(data as any[])
      setLoading(false)
    })
  }, [])

  const total = payments.reduce((s, p) => s + p.amount, 0)
  const cardTotal = payments.filter((p) => p.method === 'card').reduce((s, p) => s + p.amount, 0)
  const cashTotal = payments.filter((p) => p.method === 'cash').reduce((s, p) => s + p.amount, 0)
  const mobileTotal = payments.filter((p) => p.method === 'mobile').reduce((s, p) => s + p.amount, 0)

  if (loading) {
    return (
      <div className="flex-1 min-h-0 overflow-y-auto p-6 animate-fade-in">
        <div className="flex items-center justify-center h-full text-gray-400">Loading payments...</div>
      </div>
    )
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payments</h1>
          <p className="text-sm text-gray-500 mt-1">Track all payment transactions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">Today</Button>
          <Button variant="outline" size="sm">This Week</Button>
          <Button variant="default" size="sm">This Month</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Collected', value: total, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-500/10' },
          { label: 'Card Payments', value: cardTotal, icon: CreditCard, color: 'text-accent', bg: 'bg-accent/5' },
          { label: 'Cash Payments', value: cashTotal, icon: Banknote, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-500/10' },
          { label: 'Mobile Payments', value: mobileTotal, icon: Smartphone, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-500/10' },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className={`text-xl font-bold ${stat.color}`}>{formatCurrency(stat.value)}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payment History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {payments.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No payments recorded yet</div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {payments.map((payment) => {
                const Icon = methodIcons[payment.method] || CreditCard
                return (
                  <div key={payment.id} className="flex items-center justify-between px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700">
                        <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {methodNames[payment.method] || payment.method}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {payment.order?.id ? `Order ${payment.order.id.slice(0, 8)}` : ''} &middot; {new Date(payment.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(payment.amount)}</span>
                      <Badge variant={payment.status === 'completed' ? 'success' : 'warning'} className="capitalize text-xs">
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
