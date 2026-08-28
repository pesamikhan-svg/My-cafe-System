import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CalendarCheck, Clock, Users, Phone, Plus, X, Loader2, Edit2, Trash2 } from 'lucide-react'
import * as db from '@/lib/db-api'
import type { Reservation } from '@/types'

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingRes, setEditingRes] = useState<Reservation | null>(null)
  const [form, setForm] = useState({ name: '', guests: 2, time: '12:00', date: new Date().toISOString().split('T')[0], phone: '' })
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    const data = await db.reservationsGetAll()
    setReservations(data as Reservation[])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleStatus = async (id: string, status: string) => {
    await db.reservationsUpdate(id, { status })
    load()
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingRes) return
    setSaving(true)
    await db.reservationsUpdate(editingRes.id, {
      name: form.name,
      guests: form.guests,
      time: form.time,
      date: form.date,
      phone: form.phone || null,
    })
    setSaving(false)
    setEditingRes(null)
    setForm({ name: '', guests: 2, time: '12:00', date: new Date().toISOString().split('T')[0], phone: '' })
    load()
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this reservation?')) return
    await db.reservationsDelete(id)
    load()
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await db.reservationsCreate({
      name: form.name,
      guests: form.guests,
      time: form.time,
      date: form.date,
      status: 'pending',
      phone: form.phone || null,
    })
    setSaving(false)
    setShowForm(false)
    setForm({ name: '', guests: 2, time: '12:00', date: new Date().toISOString().split('T')[0], phone: '' })
    load()
  }

  if (loading) {
    return (
      <div className="flex-1 min-h-0 overflow-y-auto p-6 animate-fade-in">
        <div className="flex items-center justify-center h-full text-gray-400">Loading reservations...</div>
      </div>
    )
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reservations</h1>
          <p className="text-sm text-gray-500 mt-1">Manage table reservations</p>
        </div>
        <Button className="gap-2" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4" />
          New Reservation
        </Button>
      </div>

      <div className="grid gap-4">
        {reservations.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <CalendarCheck className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
            <p className="font-medium">No reservations yet</p>
          </div>
        )}
        {reservations.map((res) => (
          <Card key={res.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10">
                    <Users className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{res.name}</h3>
                    <div className="flex items-center gap-3 mt-1.5 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{res.guests} guests</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{res.time}</span>
                      <span className="flex items-center gap-1"><CalendarCheck className="w-3.5 h-3.5" />{res.date}</span>
                    </div>
                    {res.phone && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                        <Phone className="w-3 h-3" />{res.phone}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={res.status === 'confirmed' ? 'success' : res.status === 'cancelled' ? 'destructive' : 'warning'} className="capitalize">
                    {res.status}
                  </Badge>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => { setEditingRes(res); setForm({ name: res.name, guests: res.guests, time: res.time, date: res.date, phone: res.phone || '' }) }}>
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-7 h-7 text-red-500 hover:text-red-600" onClick={() => handleDelete(res.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  {res.status === 'pending' && (
                    <div className="flex gap-1">
                      <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => handleStatus(res.id, 'confirmed')}>Confirm</Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs text-red-500" onClick={() => handleStatus(res.id, 'cancelled')}>Cancel</Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(showForm || editingRes) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{editingRes ? 'Edit Reservation' : 'New Reservation'}</h2>
              <button onClick={() => { setShowForm(false); setEditingRes(null) }} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={editingRes ? handleEdit : handleCreate} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="flex h-10 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Guests</label>
                  <input required type="number" min="1" max="20" value={form.guests} onChange={(e) => setForm({ ...form, guests: parseInt(e.target.value) || 2 })} className="flex h-10 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time</label>
                  <input required type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="flex h-10 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                <input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="flex h-10 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone (optional)</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="flex h-10 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingRes(null) }}>Cancel</Button>
                <Button type="submit" disabled={saving} className="gap-2">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingRes ? 'Update Reservation' : 'Create Reservation'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
