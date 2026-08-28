const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// Prevent PowerShell from escaping our timeout
execSync('ping -n 3 127.0.0.1 >nul', { shell: 'cmd.exe' })

const dir = path.resolve(__dirname, '..', 'prisma', 'generated-client')
if (fs.existsSync(dir)) {
  let found = false
  fs.readdirSync(dir).filter(f => f.endsWith('.tmp')).forEach(f => {
    fs.rmSync(path.join(dir, f))
    console.log('Removed stale tmp file:', f)
    found = true
  })
  if (!found) console.log('No tmp files found')
}
