import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  const code = localStorage.getItem('currencyCode') || 'PKR'
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: code,
    }).format(amount)
  } catch {
    return `${code} ${amount.toFixed(2)}`
  }
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function generateStaffId(index: number): string {
  return `STF-${String(index).padStart(3, '0')}`
}

export function calculateSalary(params: {
  basicSalary: number
  overtimeHours: number
  overtimeRate: number
  bonuses: number
  allowances: number
  deductions: number
  advanceDeduction: number
  latePenalties: number
}): number {
  const overtimePay = params.overtimeHours * params.overtimeRate
  return Math.round((
    params.basicSalary +
    overtimePay +
    params.bonuses +
    params.allowances -
    params.deductions -
    params.advanceDeduction -
    params.latePenalties
  ) * 100) / 100
}

export function getMonthName(month: number): string {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  return months[month - 1] || ''
}

export function exportToCSV(data: Record<string, unknown>[], filename: string): void {
  if (data.length === 0) return
  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(h => {
      const val = row[h]
      return typeof val === 'string' && val.includes(',') ? `"${val}"` : String(val)
    }).join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${filename}.csv`
  link.click()
  URL.revokeObjectURL(link.href)
}

export function printElement(elementId: string): void {
  const element = document.getElementById(elementId)
  if (!element) { alert('Print content not found. Switch to the Reports tab first.'); return }
  const iframe = document.createElement('iframe')
  iframe.style.position = 'fixed'
  iframe.style.top = '-9999px'
  iframe.style.left = '-9999px'
  iframe.style.width = '0'
  iframe.style.height = '0'
  document.body.appendChild(iframe)
  const doc = iframe.contentWindow?.document
  if (!doc) { document.body.removeChild(iframe); return }
  doc.open()
  doc.write(`
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; color: #000; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; font-size: 12px; }
          th { background: #f5f5f5; font-weight: 600; }
          h2 { color: #333; font-size: 16px; margin-bottom: 12px; }
          .text-right { text-align: right; }
          .mt-4 { margin-top: 16px; }
          .mb-4 { margin-bottom: 16px; }
          .text-xs { font-size: 11px; }
          .font-bold { font-weight: 700; }
          .font-medium { font-weight: 500; }
          .capitalize { text-transform: capitalize; }
        </style>
      </head>
      <body>${element.innerHTML}</body>
    </html>
  `)
  doc.close()
  setTimeout(() => {
    iframe.contentWindow?.print()
    setTimeout(() => document.body.removeChild(iframe), 500)
  }, 250)
}
