import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Eye, Printer, Trash2, X, Package, Clock, Hash, User, Filter } from 'lucide-react'
import * as db from '@/lib/db-api'
import { formatCurrency } from '@/lib/utils'
import type { Order, Payment, CartItem } from '@/types'

const statusBadge: Record<string, 'success' | 'warning' | 'destructive'> = {
  completed: 'success',
  pending: 'warning',
  cancelled: 'destructive',
}

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  completed: 'Completed',
  cancelled: 'Cancelled',
  held: 'Held',
  draft: 'Draft',
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [detailOrder, setDetailOrder] = useState<any>(null)
  const [loadingDetail, setLoadingDetail] = useState(false)

  const loadOrders = async () => {
    setLoading(true)
    const data = await db.ordersGetAll()
    setOrders(data as Order[])
    setLoading(false)
  }

  useEffect(() => { loadOrders() }, [])

  const filteredOrders = orders.filter((order) => {
    const q = search.toLowerCase()
    const matchesSearch = !q ||
      order.invoiceNumber?.toLowerCase().includes(q) ||
      order.customerName?.toLowerCase().includes(q)
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter.toLowerCase()
    const orderDate = new Date(order.createdAt)
    const matchesFrom = !dateFrom || orderDate >= new Date(dateFrom)
    const matchesTo = !dateTo || orderDate <= new Date(dateTo + 'T23:59:59')
    return matchesSearch && matchesStatus && matchesFrom && matchesTo
  })

  const handleViewDetails = async (order: Order) => {
    setLoadingDetail(true)
    setDetailOrder(null)
    try {
      const full = await db.ordersGetById(order.id)
      setDetailOrder(full)
    } catch {
      setDetailOrder(order)
    }
    setLoadingDetail(false)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) return
    await db.ordersDelete(id)
    loadOrders()
    if (detailOrder?.id === id) setDetailOrder(null)
  }

  const handlePrintBill = (order: Order) => {
    const itemRows = (order.items || []).map(
      (item: CartItem) => `<tr>
        <td style="padding:6px 8px;border:1px solid #ccc;font-size:12px">${item.product?.name || 'Item'}</td>
        <td style="padding:6px 8px;border:1px solid #ccc;font-size:12px;text-align:center">${item.quantity}</td>
        <td style="padding:6px 8px;border:1px solid #ccc;font-size:12px;text-align:right">${formatCurrency(item.product?.price || 0)}</td>
        <td style="padding:6px 8px;border:1px solid #ccc;font-size:12px;text-align:right">${formatCurrency((item.product?.price || 0) * item.quantity)}</td>
      </tr>`
    ).join('')

    const notesHtml = (order.items || [])
      .filter((item: CartItem) => item.notes)
      .map((item: CartItem) => `<p style="font-size:11px;color:#555;margin:2px 0">${item.product?.name}: ${item.notes}</p>`)
      .join('')

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice ${order.invoiceNumber || order.id}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 30px; color: #000; max-width: 400px; margin: 0 auto; }
    h1 { font-size: 20px; text-align: center; margin-bottom: 4px; }
    .shop { text-align: center; font-size: 12px; color: #666; margin-bottom: 16px; }
    .divider { border-top: 1px dashed #999; margin: 12px 0; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #f5f5f5; font-weight: 600; font-size: 12px; padding: 6px 8px; border: 1px solid #ccc; }
    td { font-size: 12px; padding: 6px 8px; border: 1px solid #ccc; }
    .total-row td { font-weight: 700; font-size: 14px; }
    .footer { text-align: center; font-size: 11px; color: #888; margin-top: 16px; }
  </style>
</head>
<body>
  <h1>${document.title || 'Cafe POS'}</h1>
  <div class="shop">Order Invoice</div>
  <div class="divider"></div>
  <p style="font-size:12px;margin:4px 0"><strong>Invoice:</strong> ${order.invoiceNumber || 'N/A'}</p>
  <p style="font-size:12px;margin:4px 0"><strong>Customer:</strong> ${order.customerName || 'Walk-in'}</p>
  <p style="font-size:12px;margin:4px 0"><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()} ${new Date(order.createdAt).toLocaleTimeString()}</p>
  ${order.tableNumber ? `<p style="font-size:12px;margin:4px 0"><strong>Table:</strong> ${order.tableNumber}</p>` : ''}
  <div class="divider"></div>
  <table>
    <thead>
      <tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr>
    </thead>
    <tbody>
      ${itemRows}
    </tbody>
  </table>
  ${notesHtml ? `<div class="divider"></div><p style="font-size:11px;font-weight:600;margin:4px 0">Notes:</p>${notesHtml}` : ''}
  <div class="divider"></div>
  <table>
    <tr><td style="border:none;font-size:12px;text-align:right;padding:2px 4px">Subtotal:</td><td style="border:none;font-size:12px;text-align:right;padding:2px 4px">${formatCurrency(order.subtotal)}</td></tr>
    ${order.discount > 0 ? `<tr><td style="border:none;font-size:12px;text-align:right;padding:2px 4px">Discount:</td><td style="border:none;font-size:12px;text-align:right;padding:2px 4px;color:#e53935">-${formatCurrency(order.discount)}</td></tr>` : ''}
    ${order.tax > 0 ? `<tr><td style="border:none;font-size:12px;text-align:right;padding:2px 4px">Tax:</td><td style="border:none;font-size:12px;text-align:right;padding:2px 4px">${formatCurrency(order.tax)}</td></tr>` : ''}
    ${order.serviceCharge > 0 ? `<tr><td style="border:none;font-size:12px;text-align:right;padding:2px 4px">Service Charge:</td><td style="border:none;font-size:12px;text-align:right;padding:2px 4px">${formatCurrency(order.serviceCharge)}</td></tr>` : ''}
    <tr class="total-row"><td style="border:none;font-size:14px;text-align:right;padding:4px;border-top:2px solid #000">Total:</td><td style="border:none;font-size:14px;text-align:right;padding:4px;border-top:2px solid #000">${formatCurrency(order.total)}</td></tr>
  </table>
  <div class="divider"></div>
  <div class="footer">Thank you for your order!</div>
</body>
</html>`

    const win = window.open('', '_blank')
    if (!win) { alert('Please allow pop-ups to print bills.'); return }
    win.document.write(html)
    win.document.close()
    win.focus()
    setTimeout(() => { win.print() }, 300)
  }

  if (loading) {
    return (
      <div className="flex-1 min-h-0 overflow-y-auto p-6 animate-fade-in">
        <div className="flex items-center justify-center h-full text-gray-400">Loading orders...</div>
      </div>
    )
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Order History</h1>
          <p className="text-sm text-gray-500 mt-1">View and manage all orders</p>
        </div>
        <Badge variant="secondary" className="gap-1.5">
          <Package className="w-3.5 h-3.5" />
          {orders.length} Total Orders
        </Badge>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by invoice or customer..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-3 flex-wrap">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="flex h-10 rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none pl-10 pr-8 text-gray-900 dark:text-white"
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-36"
                  placeholder="From"
                />
                <span className="text-gray-400 text-sm">-</span>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-36"
                  placeholder="To"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <CardTitle className="text-base">Orders</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="font-medium">No orders found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700">
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="text-center px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                    <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="text-center px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Hash className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="font-mono text-sm text-gray-900 dark:text-white">
                            {order.invoiceNumber || order.id.slice(0, 8).toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {order.customerName || 'Walk-in'}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {order.items?.length || 0}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="font-semibold text-sm text-gray-900 dark:text-white">
                          {formatCurrency(order.total)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <Badge variant={statusBadge[order.status] || 'default'} className="capitalize text-xs">
                          {statusLabels[order.status] || order.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="w-8 h-8" title="View Details"
                            onClick={() => handleViewDetails(order)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="w-8 h-8" title="Print Bill"
                            onClick={() => handlePrintBill(order)}>
                            <Printer className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="w-8 h-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10" title="Delete"
                            onClick={() => handleDelete(order.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {detailOrder && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 animate-fade-in pt-12 pb-12 overflow-y-auto"
          onClick={() => setDetailOrder(null)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Order Details</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {detailOrder.invoiceNumber || detailOrder.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
              <button onClick={() => setDetailOrder(null)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            {loadingDetail ? (
              <div className="p-8 text-center text-gray-400">Loading order details...</div>
            ) : (
              <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Customer</span>
                    <p className="font-medium text-gray-900 dark:text-white">{detailOrder.customerName || 'Walk-in'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Status</span>
                    <Badge variant={statusBadge[detailOrder.status] || 'default'} className="capitalize text-xs mt-1">
                      {statusLabels[detailOrder.status] || detailOrder.status}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-gray-500">Date</span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(detailOrder.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Time</span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(detailOrder.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  {detailOrder.tableNumber && (
                    <div>
                      <span className="text-gray-500">Table</span>
                      <p className="font-medium text-gray-900 dark:text-white">{detailOrder.tableNumber}</p>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Items ({detailOrder.items?.length || 0})
                  </h3>
                  <div className="divide-y divide-gray-100 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                    {detailOrder.items?.map((item: CartItem, idx: number) => (
                      <div key={idx} className="px-3 py-2.5 flex items-center justify-between text-sm">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate">
                            {item.product?.name || 'Unknown Item'}
                          </p>
                          {item.notes && (
                            <p className="text-xs text-gray-500 mt-0.5 italic">{item.notes}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-3 shrink-0 ml-3">
                          <span className="text-gray-500">x{item.quantity}</span>
                          <span className="font-medium text-gray-900 dark:text-white w-20 text-right">
                            {formatCurrency((item.product?.price || 0) * item.quantity)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1 text-sm border-t border-gray-100 dark:border-gray-700 pt-3">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span>{formatCurrency(detailOrder.subtotal)}</span>
                  </div>
                  {detailOrder.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-{formatCurrency(detailOrder.discount)}</span>
                    </div>
                  )}
                  {detailOrder.tax > 0 && (
                    <div className="flex justify-between text-gray-500">
                      <span>Tax</span>
                      <span>{formatCurrency(detailOrder.tax)}</span>
                    </div>
                  )}
                  {detailOrder.serviceCharge > 0 && (
                    <div className="flex justify-between text-gray-500">
                      <span>Service Charge</span>
                      <span>{formatCurrency(detailOrder.serviceCharge)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-gray-900 dark:text-white pt-1 border-t border-gray-200 dark:border-gray-700">
                    <span>Total</span>
                    <span className="text-orange-500">{formatCurrency(detailOrder.total)}</span>
                  </div>
                </div>

                {detailOrder.payments && detailOrder.payments.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Payments</h3>
                    <div className="divide-y divide-gray-100 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                      {detailOrder.payments.map((payment: Payment) => (
                        <div key={payment.id} className="px-3 py-2.5 flex items-center justify-between text-sm">
                          <span className="capitalize text-gray-700 dark:text-gray-300">{payment.method}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(payment.amount)}</span>
                            <Badge variant={payment.status === 'completed' ? 'success' : 'warning'} className="text-xs">
                              {payment.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setDetailOrder(null)}>Close</Button>
              <Button className="flex-1 gap-2" onClick={() => handlePrintBill(detailOrder)}>
                <Printer className="w-4 h-4" />
                Print Bill
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
