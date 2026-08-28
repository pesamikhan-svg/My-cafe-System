import { Order, CartItem } from '@/types'
import { formatCurrency } from './utils'

function getCurrentDateTime(): string {
  const d = new Date()
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString()
}

function generateBillHTML(order: Order): string {
  const itemsHtml = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding:4px 0">${item.product.name} x${item.quantity}</td>
      <td style="padding:4px 0;text-align:right">${formatCurrency(item.product.price * item.quantity)}</td>
    </tr>`
    )
    .join('')

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Bill</title>
  <style>
    @page { margin: 0; }
    body { font-family: 'Courier New', monospace; font-size: 12px; width: 80mm; padding: 10px; margin: 0 auto; }
    h1 { text-align: center; font-size: 16px; margin: 0 0 4px 0; }
    h2 { text-align: center; font-size: 13px; margin: 0 0 4px 0; }
    .center { text-align: center; }
    .line { border-top: 1px dashed #333; margin: 6px 0; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; border-bottom: 1px solid #333; padding: 4px 0; }
    .total-row td { font-weight: bold; padding-top: 6px; }
    .footer { text-align: center; font-size: 10px; margin-top: 10px; color: #666; }
  </style>
</head>
<body>
  <h1>☕ Cafe POS</h1>
  <h2>INVOICE</h2>
  <div class="center">${getCurrentDateTime()}</div>
  <div class="center">Order #${order.id.slice(0, 8).toUpperCase()}</div>
  ${order.tableNumber ? `<div class="center">Table: ${order.tableNumber}</div>` : ''}
  ${order.customerName ? `<div class="center">Customer: ${order.customerName}</div>` : ''}
  <div class="line"></div>
  <table>
    <thead><tr><th>Item</th><th style="text-align:right">Amount</th></tr></thead>
    <tbody>${itemsHtml}</tbody>
  </table>
  <div class="line"></div>
  <table>
    <tr><td>Subtotal</td><td style="text-align:right">${formatCurrency(order.subtotal)}</td></tr>
    <tr><td>Tax (8%)</td><td style="text-align:right">${formatCurrency(order.tax)}</td></tr>
    <tr><td>Service Charge (5%)</td><td style="text-align:right">${formatCurrency(order.serviceCharge)}</td></tr>
    ${order.discount > 0 ? `<tr><td>Discount</td><td style="text-align:right">-${formatCurrency(order.discount)}</td></tr>` : ''}
    <tr class="total-row"><td>Total</td><td style="text-align:right">${formatCurrency(order.total)}</td></tr>
  </table>
  <div class="line"></div>
  <div class="footer">Thank you for visiting!<br>Have a great day!</div>
</body>
</html>`
}

function generateKOTHTML(order: Order): string {
  const itemsHtml = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding:3px 0">${item.product.name}</td>
      <td style="padding:3px 0;text-align:center">x${item.quantity}</td>
      ${item.notes ? `<td style="padding:3px 0;color:#888">${item.notes}</td>` : ''}
    </tr>`
    )
    .join('')

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>KOT</title>
  <style>
    @page { margin: 0; }
    body { font-family: 'Courier New', monospace; font-size: 12px; width: 80mm; padding: 10px; margin: 0 auto; }
    h1 { text-align: center; font-size: 16px; margin: 0 0 4px 0; }
    .center { text-align: center; }
    .line { border-top: 1px dashed #333; margin: 6px 0; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; border-bottom: 1px solid #333; padding: 4px 0; }
    .footer { text-align: center; font-size: 10px; margin-top: 10px; color: #666; }
    .kot-label { text-align: center; font-size: 20px; font-weight: bold; letter-spacing: 4px; margin: 4px 0; }
  </style>
</head>
<body>
  <h1>☕ Cafe POS</h1>
  <div class="kot-label">KOT</div>
  <div class="center">${getCurrentDateTime()}</div>
  <div class="center">Order #${order.id.slice(0, 8).toUpperCase()}</div>
  ${order.tableNumber ? `<div class="center">TABLE: ${order.tableNumber}</div>` : ''}
  <div class="line"></div>
  <table>
    <thead><tr><th>Item</th><th style="text-align:center">Qty</th>${order.items.some(i => i.notes) ? '<th style="text-align:left">Notes</th>' : ''}</tr></thead>
    <tbody>${itemsHtml}</tbody>
  </table>
  <div class="line"></div>
  <div class="footer">** Kitchen Copy **</div>
</body>
</html>`
}

export function printBill(order: Order): void {
  const html = generateBillHTML(order)
  const win = window.open('', '_blank')
  if (!win) return
  win.document.write(html)
  win.document.close()
  win.focus()
  setTimeout(() => win.print(), 300)
}

export function printKOT(order: Order): void {
  const html = generateKOTHTML(order)
  const win = window.open('', '_blank')
  if (!win) return
  win.document.write(html)
  win.document.close()
  win.focus()
  setTimeout(() => win.print(), 300)
}
