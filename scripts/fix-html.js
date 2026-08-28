const fs = require('fs')
const path = require('path')

const htmlPath = path.resolve(__dirname, '..', 'dist', 'index.html')
let html = fs.readFileSync(htmlPath, 'utf-8')
html = html
  .replace(/\bcrossorigin\b\s*=\s*["'][^"']*["']/gi, '')
  .replace(/\bcrossorigin\b/gi, '')
  .replace(/<link[^>]*rel\s*=\s*["']icon["'][^>]*\/?>/gi, '')
fs.writeFileSync(htmlPath, html, 'utf-8')
