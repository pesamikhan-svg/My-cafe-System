// copy-prisma.js - copies .prisma/client to a location electron-builder can include
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const src = path.join(root, 'node_modules', '.prisma', 'client')
const dest = path.join(root, 'prisma', 'generated-client')

if (fs.existsSync(dest)) fs.rmSync(dest, { recursive: true })
fs.cpSync(src, dest, { recursive: true })
// Remove stale .tmp files that Prisma generate sometimes leaves behind
const tmpFiles = fs.readdirSync(dest).filter(f => f.endsWith('.tmp'))
for (const f of tmpFiles) fs.rmSync(path.join(dest, f))
console.log('Prisma client copied to prisma/generated-client')
