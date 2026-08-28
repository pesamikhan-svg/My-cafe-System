import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table2, Users, Coffee, RefreshCw, Plus, X, Check, Loader2, Edit2, Trash2 } from 'lucide-react'
import * as db from '@/lib/db-api'
import type { Table } from '@/types'

export default function TablesPage() {
  const [tables, setTables] = useState<Table[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [newSeats, setNewSeats] = useState('4')
  const [newId, setNewId] = useState('')
  const [saving, setSaving] = useState(false)
  const [editingTable, setEditingTable] = useState<Table | null>(null)

  const load = async () => {
    setLoading(true)
    const data = await db.tablesGetAll()
    setTables(data as Table[])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleReset = async () => {
    const data = await db.tablesResetAll()
    setTables(data as Table[])
  }

  const handleAdd = async () => {
    const id = parseInt(newId)
    if (!id || id < 1) return
    const seats = parseInt(newSeats) || 4
    setSaving(true)
    try {
      await db.tablesCreate({ id, seats, status: 'available', server: null })
      setShowAdd(false)
      setNewId('')
      setNewSeats('4')
      await load()
    } catch (e) {
      alert('Failed to add table. The ID may already exist.')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = async () => {
    if (!editingTable) return
    const seats = parseInt(newSeats) || editingTable.seats
    setSaving(true)
    try {
      await db.tablesUpdate(editingTable.id, { seats })
      setEditingTable(null)
      setNewId('')
      setNewSeats('4')
      await load()
    } catch (e) {
      alert('Failed to update table.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this table?')) return
    await db.tablesDelete(id)
    await load()
  }

  const handleStatusToggle = async (table: Table) => {
    const next = table.status === 'available' ? 'occupied' : 'available'
    await db.tablesUpdate(table.id, { status: next })
    await load()
  }

  const available = tables.filter((t) => t.status === 'available').length
  const occupied = tables.filter((t) => t.status === 'occupied').length
  const reserved = tables.filter((t) => t.status === 'reserved').length

  if (loading) {
    return (
      <div className="flex-1 min-h-0 overflow-y-auto p-6 animate-fade-in">
        <div className="flex items-center justify-center h-full text-gray-400">Loading tables...</div>
      </div>
    )
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Table Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your restaurant tables</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" className="gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            {available} Available
          </Badge>
          <Badge variant="default" className="gap-1">
            <div className="w-2 h-2 rounded-full bg-accent" />
            {occupied} Occupied
          </Badge>
          <Badge variant="warning" className="gap-1">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            {reserved} Reserved
          </Badge>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setShowAdd(true)}>
            <Plus className="w-3.5 h-3.5" />
            Add Table
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleReset}>
            <RefreshCw className="w-3.5 h-3.5" />
            Reset All
          </Button>
        </div>
      </div>

      {tables.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <Table2 className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600" />
          <p className="text-lg font-medium">No tables yet</p>
          <p className="text-sm mt-1">Click "Add Table" to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tables.map((table) => (
            <Card
              key={table.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                table.status === 'available'
                  ? 'hover:border-green-300 dark:hover:border-green-700'
                  : table.status === 'occupied'
                  ? 'border-accent/30 bg-accent/5'
                  : 'hover:border-yellow-300 dark:hover:border-yellow-700'
              }`}
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700">
                    <Table2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </div>
                  <Badge variant={
                    table.status === 'available' ? 'success' :
                    table.status === 'occupied' ? 'default' : 'warning'
                  } className="text-xs capitalize">
                    {table.status}
                  </Badge>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Table {table.id}</h3>
                <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                  <Users className="w-3.5 h-3.5" />
                  <span>Up to {table.seats} guests</span>
                </div>
                {table.server && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-accent">
                    <Coffee className="w-3 h-3" />
                    <span>Served by {table.server}</span>
                  </div>
                )}
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant={table.status === 'available' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => handleStatusToggle(table)}
                  >
                    {table.status === 'available' ? 'Assign Table' : table.status === 'occupied' ? 'Mark Available' : 'Reserved'}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-8 h-8 p-0"
                    onClick={() => { setEditingTable(table); setNewSeats(String(table.seats)); setNewId(String(table.id)) }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-8 h-8 p-0 text-red-500 hover:text-red-600"
                    onClick={() => handleDelete(table.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {editingTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Table {editingTable.id}</h2>
              <button onClick={() => setEditingTable(null)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Seats</label>
                <Input
                  type="number"
                  min="1"
                  value={newSeats}
                  onChange={(e) => setNewSeats(e.target.value)}
                />
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setEditingTable(null)}>Cancel</Button>
              <Button className="flex-1 gap-2" disabled={saving} onClick={handleEdit}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Table</h2>
              <button onClick={() => setShowAdd(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Table Number</label>
                <Input
                  type="number"
                  min="1"
                  placeholder="e.g. 13"
                  value={newId}
                  onChange={(e) => setNewId(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Seats</label>
                <Input
                  type="number"
                  min="1"
                  placeholder="e.g. 4"
                  value={newSeats}
                  onChange={(e) => setNewSeats(e.target.value)}
                />
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button className="flex-1 gap-2" disabled={!newId || saving} onClick={handleAdd}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {saving ? 'Adding...' : 'Add Table'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
