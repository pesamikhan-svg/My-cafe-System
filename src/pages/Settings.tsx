import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import * as db from '@/lib/db-api'
import { useNavigate } from 'react-router-dom'
import {
  Settings2, User, Printer, Database, Shield, Bell, Palette,
  Download, Upload, Check, Loader2, Sun, Moon, Monitor,
} from 'lucide-react'

const sections = [
  { key: 'profile', icon: User, label: 'Profile Settings', desc: 'Manage your account details and preferences' },
  { key: 'printer', icon: Printer, label: 'Printer Configuration', desc: 'Configure thermal printer and KOT settings' },
  { key: 'backup', icon: Database, label: 'Backup & Restore', desc: 'Backup your data or restore from a previous backup' },
  { key: 'staff', icon: Shield, label: 'Staff & Roles', desc: 'Manage staff accounts and permissions' },
  { key: 'notifications', icon: Bell, label: 'Notifications', desc: 'Configure notification preferences' },
  { key: 'appearance', icon: Palette, label: 'Appearance', desc: 'Customize the look and feel of the application' },
]

export default function Settings() {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('profile')
  const [storeName, setStoreName] = useState('My Cafe')
  const [taxRate, setTaxRate] = useState('8')
  const [serviceCharge, setServiceCharge] = useState('5')
  const currencies = [
  { code: 'PKR', label: 'PKR (Rs)' },
  { code: 'USD', label: 'USD ($)' },
  { code: 'EUR', label: 'EUR (€)' },
  { code: 'GBP', label: 'GBP (£)' },
  { code: 'INR', label: 'INR (₹)' },
  { code: 'AED', label: 'AED (د.إ)' },
  { code: 'SAR', label: 'SAR (﷼)' },
]
const [currency, setCurrency] = useState(() => localStorage.getItem('currencyCode') || 'PKR')
  const [kotHeader, setKotHeader] = useState('')
  const [kotFooter, setKotFooter] = useState('')
  const [notifSound, setNotifSound] = useState(true)
  const [notifOrder, setNotifOrder] = useState(true)
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true')
  const [saving, setSaving] = useState(false)
  const [backingUp, setBackingUp] = useState(false)
  const [restoring, setRestoring] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    Promise.all([
      db.metaGet('storeName'),
      db.metaGet('taxRate'),
      db.metaGet('serviceCharge'),
      db.metaGet('currency'),
      db.metaGet('kotHeader'),
      db.metaGet('kotFooter'),
    ]).then(([name, tax, charge, curr, kHead, kFoot]) => {
      if (name) setStoreName(name)
      if (tax) setTaxRate(tax)
      if (charge) setServiceCharge(charge)
      if (curr) { setCurrency(curr); localStorage.setItem('currencyCode', curr) }
      if (kHead) setKotHeader(kHead)
      if (kFoot) setKotFooter(kFoot)
    })
  }, [])

  const showMessage = (msg: string) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    localStorage.setItem('currencyCode', currency)
    const curLabel = currencies.find((c) => c.code === currency)?.label || currency
    localStorage.setItem('currencyDisplay', curLabel)
    await Promise.all([
      db.metaSet('storeName', storeName),
      db.metaSet('taxRate', taxRate),
      db.metaSet('serviceCharge', serviceCharge),
      db.metaSet('currency', currency),
    ])
    setSaving(false)
    showMessage('Settings saved successfully')
  }

  const handleSavePrinter = async () => {
    setSaving(true)
    await Promise.all([
      db.metaSet('kotHeader', kotHeader),
      db.metaSet('kotFooter', kotFooter),
    ])
    setSaving(false)
    showMessage('Printer settings saved')
  }

  const handleBackup = async () => {
    setBackingUp(true)
    try { const ok = await db.backupCreate(); if (ok) showMessage('Backup created successfully') }
    catch { showMessage('Backup failed') }
    setBackingUp(false)
  }

  const handleRestore = async () => {
    if (!window.confirm('Restore will replace all current data. The app must be restarted. Continue?')) return
    setRestoring(true)
    try { const ok = await db.backupRestore(); if (ok) showMessage('Restore complete. Please restart the app.') }
    catch { showMessage('Restore failed') }
    setRestoring(false)
  }

  const toggleDarkMode = (val: boolean) => {
    setDarkMode(val)
    localStorage.setItem('darkMode', String(val))
    document.documentElement.classList.toggle('dark', val)
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <Card>
            <CardHeader><CardTitle className="text-lg">Profile Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Store Name</label>
                  <Input value={storeName} onChange={(e) => setStoreName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Tax Rate (%)</label>
                  <Input type="number" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Service Charge (%)</label>
                  <Input type="number" value={serviceCharge} onChange={(e) => setServiceCharge(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {currencies.map((c) => (
                      <option key={c.code} value={c.code}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} disabled={saving} className="gap-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )

      case 'printer':
        return (
          <Card>
            <CardHeader><CardTitle className="text-lg">Printer Configuration</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">KOT Header Text</label>
                <Input value={kotHeader} onChange={(e) => setKotHeader(e.target.value)} placeholder="e.g. My Cafe - Kitchen Order" />
                <p className="text-xs text-gray-500">Printed at the top of every KOT</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">KOT Footer Text</label>
                <Input value={kotFooter} onChange={(e) => setKotFooter(e.target.value)} placeholder="e.g. Thank you!" />
                <p className="text-xs text-gray-500">Printed at the bottom of every KOT</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Paper Size</label>
                <select className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm">
                  <option value="80mm">80mm (Standard)</option>
                  <option value="58mm">58mm (Small)</option>
                </select>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSavePrinter} disabled={saving} className="gap-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Save Printer Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        )

      case 'backup':
        return (
          <Card>
            <CardHeader><CardTitle className="text-lg">Backup & Restore</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-500">Create a backup of your entire database or restore from a previous backup file.</p>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Create Backup</p>
                  <p className="text-xs text-gray-500">Download a copy of your data</p>
                </div>
                <Button size="sm" className="gap-2" onClick={handleBackup} disabled={backingUp}>
                  {backingUp ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  Backup Now
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Restore Backup</p>
                  <p className="text-xs text-gray-500">Replace current data with a backup</p>
                </div>
                <Button variant="outline" size="sm" className="gap-2" onClick={handleRestore} disabled={restoring}>
                  {restoring ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  Restore
                </Button>
              </div>
            </CardContent>
          </Card>
        )

      case 'staff':
        return (
          <Card>
            <CardHeader><CardTitle className="text-lg">Staff & Roles</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-500">Manage staff accounts, roles, and permissions from the Staff page.</p>
              <Button onClick={() => navigate('/staff')} className="gap-2">
                <Shield className="w-4 h-4" /> Go to Staff Management
              </Button>
            </CardContent>
          </Card>
        )

      case 'notifications':
        return (
          <Card>
            <CardHeader><CardTitle className="text-lg">Notifications</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Sound Alerts</p>
                  <p className="text-xs text-gray-500">Play a sound when new orders come in</p>
                </div>
                <button
                  onClick={() => setNotifSound(!notifSound)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${notifSound ? 'bg-accent' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-transform ${notifSound ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
                </button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Order Notifications</p>
                  <p className="text-xs text-gray-500">Show desktop notifications for new orders</p>
                </div>
                <button
                  onClick={() => setNotifOrder(!notifOrder)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${notifOrder ? 'bg-accent' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-transform ${notifOrder ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
                </button>
              </div>
            </CardContent>
          </Card>
        )

      case 'appearance':
        return (
          <Card>
            <CardHeader><CardTitle className="text-lg">Appearance</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-500">Choose your preferred theme for the application.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => toggleDarkMode(false)}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${!darkMode ? 'border-accent bg-accent/5' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}
                >
                  <Sun className="w-8 h-8 text-orange-500" />
                  <span className="text-sm font-medium">Light Mode</span>
                </button>
                <button
                  onClick={() => toggleDarkMode(true)}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${darkMode ? 'border-accent bg-accent/5' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}
                >
                  <Moon className="w-8 h-8 text-blue-400" />
                  <span className="text-sm font-medium">Dark Mode</span>
                </button>
              </div>
              <p className="text-xs text-gray-400 text-center">Changes are saved automatically</p>
            </CardContent>
          </Card>
        )
    }
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Configure your cafe system preferences</p>
        </div>
        <Badge variant="secondary" className="gap-1">
          <Settings2 className="w-3.5 h-3.5" />
          v1.0.0
        </Badge>
      </div>

      {message && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 text-sm animate-fade-in">
          <Check className="w-4 h-4" />
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-1">
          {sections.map((section) => {
            const Icon = section.icon
            const isActive = activeSection === section.key
            return (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors group ${
                  isActive ? 'bg-accent/10 text-accent' : 'hover:bg-accent/5 hover:text-accent'
                }`}
              >
                <div className={`flex items-center justify-center w-9 h-9 rounded-lg transition-colors ${
                  isActive ? 'bg-accent/15' : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-accent/10'
                }`}>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-accent' : 'text-gray-500 group-hover:text-accent'}`} />
                </div>
                <div>
                  <p className={`text-sm font-medium ${isActive ? 'text-accent' : 'text-gray-900 dark:text-white group-hover:text-accent'}`}>{section.label}</p>
                  <p className="text-xs text-gray-500">{section.desc}</p>
                </div>
              </button>
            )
          })}
        </div>

        <div className="lg:col-span-2 space-y-6">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}