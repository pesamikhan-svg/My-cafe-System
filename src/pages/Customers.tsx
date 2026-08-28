import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Mail, Phone, Award, DollarSign, ShoppingBag, Edit2, Trash2, X, Check, Loader2 } from 'lucide-react'
import * as db from '@/lib/db-api'
import type { Customer } from '@/types'
import { formatCurrency } from '@/lib/utils'

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '' })
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const data = await db.customersGetAll()
    setCustomers(data as Customer[])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = customers.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase())
  )

  const handleEdit = async () => {
    if (!editingCustomer) return
    setSaving(true)
    await db.customersUpdate(editingCustomer.id, editForm)
    setSaving(false)
    setEditingCustomer(null)
    load()
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return
    await db.customersDelete(id)
    load()
  }

  if (loading) {
    return (
      <div className="flex-1 min-h-0 overflow-y-auto p-6 animate-fade-in">
        <div className="flex items-center justify-center h-full text-gray-400">Loading customers...</div>
      </div>
    )
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customers</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your customer relationships</p>
        </div>
        <Badge variant="secondary" className="gap-1.5">
          <Award className="w-3.5 h-3.5" />
          {customers.length} Total Customers
        </Badge>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input placeholder="Search customers..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="grid gap-4">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="font-medium">No customers found</p>
          </div>
        )}
        {filtered.map((customer) => (
          <Card key={customer.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name)}&background=F97316&color=fff`}
                    alt={customer.name}
                    fallback={customer.name.split(' ').map(n => n[0]).join('')}
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{customer.name}</h3>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                      {customer.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5" />
                          {customer.email}
                        </span>
                      )}
                      {customer.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" />
                          {customer.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <ShoppingBag className="w-3.5 h-3.5" />
                      Orders
                    </p>
                    <p className="font-bold text-gray-900 dark:text-white">{customer.totalOrders}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5" />
                      Spent
                    </p>
                    <p className="font-bold text-accent">{formatCurrency(customer.totalSpent)}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => { setEditingCustomer(customer); setEditForm({ name: customer.name, email: customer.email || '', phone: customer.phone || '' }) }}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8 text-red-500 hover:text-red-600" onClick={() => handleDelete(customer.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Customer</h2>
              <button onClick={() => setEditingCustomer(null)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <Input value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                <Input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setEditingCustomer(null)}>Cancel</Button>
              <Button className="flex-1 gap-2" disabled={saving} onClick={handleEdit}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
