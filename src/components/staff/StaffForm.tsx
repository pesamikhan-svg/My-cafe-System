import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StaffFormData } from '@/types'
import { X, Upload } from 'lucide-react'

interface StaffFormProps {
  onSubmit: (data: StaffFormData) => void
  onClose: () => void
  initialData?: StaffFormData
}

const positions = ['Manager', 'Chef', 'Barista', 'Waiter', 'Cashier', 'Cleaner', 'Security']

export default function StaffForm({ onSubmit, onClose, initialData }: StaffFormProps) {
  const [form, setForm] = useState<StaffFormData>(
    initialData || {
      fullName: '',
      email: '',
      phone: '',
      cnic: '',
      address: '',
      joiningDate: new Date().toISOString().split('T')[0],
      position: 'Barista',
      basicSalary: 0,
      profilePhoto: '',
      isAdmin: false,
      role: 'staff',
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
  }

  const update = (field: keyof StaffFormData, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string
      update('profilePhoto', dataUrl)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto mx-4">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700/50">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {initialData ? 'Edit Staff' : 'Add New Staff'}
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0 border-2 border-dashed border-gray-300 dark:border-gray-600">
                {form.profilePhoto ? (
                  <img src={form.profilePhoto} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Upload className="w-6 h-6 text-gray-400" />
                )}
                <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/0 hover:bg-black/20 transition-colors rounded-full">
                  <span className="sr-only">Upload photo</span>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <Input required value={form.fullName} onChange={(e) => update('fullName', e.target.value)} placeholder="John Doe" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
              <Input required value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+1 555-0000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CNIC (optional)</label>
              <Input value={form.cnic} onChange={(e) => update('cnic', e.target.value)} placeholder="CNIC-000" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email (optional)</label>
              <Input value={form.email || ''} onChange={(e) => update('email', e.target.value)} placeholder="email@example.com" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
              <Input value={form.address || ''} onChange={(e) => update('address', e.target.value)} placeholder="123 Main St, City" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Joining Date</label>
              <Input required type="date" value={form.joiningDate} onChange={(e) => update('joiningDate', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Position</label>
              <select
                className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={form.position}
                onChange={(e) => update('position', e.target.value)}
              >
                {positions.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Basic Salary ($)</label>
              <Input required type="number" min="0" step="0.01" value={form.basicSalary || ''} onChange={(e) => update('basicSalary', parseFloat(e.target.value) || 0)} />
            </div>
            <div />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
            <select
              className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={form.role}
              onChange={(e) => update('role', e.target.value)}
            >
              <option value="staff">Staff</option>
              <option value="cashier">Cashier</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{initialData ? 'Update' : 'Add Staff'}</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
