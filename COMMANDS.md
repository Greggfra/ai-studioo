# 🛠️ Comandi Utili - AI Studio

Raccolta di comandi utili per sviluppo, debug e manutenzione.

## 📦 Installazione

```powershell
# Installa tutte le dipendenze (root + frontend + backend)
npm run install:all

# Oppure usa lo script PowerShell
.\install.ps1

# Solo frontend
cd frontend ; npm install

# Solo backend
cd backend ; npm install
```

## 🚀 Avvio Applicazione

```powershell
# Avvia frontend + backend insieme (consigliato)
npm run dev

# Solo frontend (porta 3000)
npm run dev:frontend
# oppure
cd frontend ; npm run dev

# Solo backend (porta 5000)
npm run dev:backend
# oppure
cd backend ; npm run dev
```

## 🏗️ Build & Produzione

```powershell
# Build frontend per produzione
cd frontend
npm run build

# Preview build produzione
npm run preview

# Avvia backend in produzione
cd backend
npm start
```

## 🧹 Pulizia

```powershell
# Rimuovi node_modules e package-lock (frontend)
cd frontend
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install

# Rimuovi node_modules e package-lock (backend)
cd backend
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install

# Pulisci cache npm globale
npm cache clean --force

# Pulisci build folder frontend
cd frontend
Remove-Item -Recurse -Force dist
```

## 🔍 Debug & Logs

```powershell
# Vedi logs backend dettagliati
cd backend
$env:DEBUG="*" ; npm run dev

# Vedi versioni installate
npm list --depth=0

# Verifica vulnerabilità
npm audit

# Fix vulnerabilità automaticamente
npm audit fix

# Verifica versioni outdated
npm outdated
```

## 🔑 Gestione Environment Variables

```powershell
# Copia template env e modifica
# Frontend
Copy-Item frontend\.env.example frontend\.env.local
notepad frontend\.env.local

# Backend
Copy-Item backend\.env.example backend\.env
notepad backend\.env

# Verifica variabili caricate (Node.js)
node -e "require('dotenv').config(); console.log(process.env)"
```

## 🧪 Testing

```powershell
# Test manuale API backend
# Health check
curl http://localhost:5000/health

# Test chat endpoint (PowerShell)
$body = @{
    message = "Ciao!"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/chat" `
  -Method POST `
  -Body $body `
  -ContentType "application/json"

# Test con Node fetch
node -e "fetch('http://localhost:5000/health').then(r=>r.json()).then(console.log)"
```

## 🔧 Firebase

```powershell
# Installa Firebase CLI
npm install -g firebase-tools

# Login Firebase
firebase login

# Inizializza progetto
firebase init

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Storage rules
firebase deploy --only storage

# Avvia emulatori locali
firebase emulators:start

# Backup Firestore
firebase firestore:export gs://your-bucket/backup-$(Get-Date -Format "yyyy-MM-dd")
```

## 📊 Monitoraggio

```powershell
# Monitoring processi Node
Get-Process node

# Terminare processo su porta specifica (Windows)
# Trova PID
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# Termina per PID
taskkill /PID <PID> /F

# Monitoring uso porte
netstat -ano | findstr LISTENING

# Monitoring file system changes
Get-ChildItem -Path . -Recurse | Where-Object {$_.LastWriteTime -gt (Get-Date).AddHours(-1)}
```

## 🔄 Git Commands

```powershell
# Init repository
git init
git add .
git commit -m "Initial commit: AI Studio v1.0.0"

# Add remote
git remote add origin https://github.com/username/ai-studio.git
git push -u origin main

# Create gitignore (già presente)
# Verifica file ignorati
git status --ignored

# Crea nuovo branch per feature
git checkout -b feature/new-feature
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature
```

## 📦 Package Management

```powershell
# Aggiorna singolo package
npm install package-name@latest

# Aggiorna tutti i minor/patch
npm update

# Installa versione specifica
npm install react@18.3.1

# Disinstalla package
npm uninstall package-name

# Verifica licenze packages
npx license-checker

# Bundle size analysis (frontend)
cd frontend
npm run build
npx vite-bundle-visualizer
```

## 🔐 Sicurezza

```powershell
# Scan vulnerabilità
npm audit

# Fix automatico
npm audit fix

# Fix forzato (può rompere cose)
npm audit fix --force

# Verifica secrets in codice (installa gitleaks)
# https://github.com/gitleaks/gitleaks
gitleaks detect --source . -v
```

## 🌐 Network & API Testing

```powershell
# Test latenza API
Measure-Command {
  Invoke-WebRequest -Uri "http://localhost:5000/health"
}

# Test con curl (se installato)
curl -X POST http://localhost:5000/api/chat `
  -H "Content-Type: application/json" `
  -d '{\"message\":\"test\"}'

# Verifica DNS
nslookup ai-studio.vercel.app

# Test SSL
curl -I https://your-domain.com
```

## 📝 Logs & Debugging

```powershell
# Salva logs in file (backend)
cd backend
npm run dev > ../logs/backend.log 2>&1

# Tail logs in tempo reale (PowerShell)
Get-Content -Path logs\backend.log -Wait -Tail 50

# Filtra errori
Get-Content backend.log | Select-String "ERROR"

# Vedi ultime 100 righe
Get-Content backend.log -Tail 100
```

## 🔄 Database Operations

```powershell
# Export Firestore data (Firebase CLI)
firebase firestore:export backup/

# Import Firestore data
firebase firestore:import backup/

# Cancella collection (attenzione!)
firebase firestore:delete --all-collections --yes

# Query Firestore da Node
node -e "
const admin = require('firebase-admin');
admin.initializeApp();
admin.firestore().collection('users').get()
  .then(snap => snap.forEach(doc => console.log(doc.data())));
"
```

## 🚀 Deploy Quick Commands

```powershell
# Vercel (frontend)
cd frontend
vercel --prod

# Build e test locale pre-deploy
npm run build
npm run preview

# Railway (backend)
railway login
railway link
railway up

# Render (backend) - via Git push
git add .
git commit -m "Deploy update"
git push origin main
```

## 📱 PWA Conversion (futuro)

```powershell
# Installa Vite PWA
cd frontend
npm install vite-plugin-pwa -D

# Genera icons
npx pwa-asset-generator logo.svg ./public/icons

# Build PWA
npm run build
```

## 🎨 Styling & Theming

```powershell
# Rigenera Tailwind CSS
cd frontend
npx tailwindcss -i ./src/index.css -o ./dist/output.css --watch

# Purge CSS non usato
npm run build # già configurato in Tailwind

# Analizza bundle CSS
npx vite-bundle-visualizer
```

## 📊 Performance Analysis

```powershell
# Frontend bundle analysis
cd frontend
npm run build
npx vite-bundle-visualizer

# Lighthouse audit (richiede Chrome)
npx lighthouse http://localhost:3000 --view

# Verifica tempi build
Measure-Command { npm run build }
```

## 🔄 Backup & Restore

```powershell
# Backup completo progetto
$date = Get-Date -Format "yyyy-MM-dd"
Compress-Archive -Path . -DestinationPath "../ai-studio-backup-$date.zip"

# Backup solo database (Firebase)
firebase firestore:export gs://your-bucket/backup-$date

# Backup env files
Copy-Item frontend\.env.local "../backup/.env.local.$date"
Copy-Item backend\.env "../backup/.env.$date"
Copy-Item backend\serviceAccountKey.json "../backup/serviceAccountKey.$date.json"
```

## 🧰 Utility Scripts

```powershell
# Crea nuovo componente React
New-Item -ItemType File -Path "frontend\src\components\NewComponent.jsx"

# Generate random secret key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Convert JSON to env format
Get-Content config.json | ConvertFrom-Json | ForEach-Object {
  $_.PSObject.Properties | ForEach-Object {
    "$($_.Name)=$($_.Value)"
  }
}

# Pretty print JSON
Get-Content file.json | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

## 📮 Quick Tests

```powershell
# Test tutti gli endpoint
$endpoints = @(
  "http://localhost:5000/health",
  "http://localhost:5000/api/chat",
  "http://localhost:3000"
)

foreach ($endpoint in $endpoints) {
  Write-Host "Testing $endpoint..."
  try {
    $response = Invoke-WebRequest -Uri $endpoint -TimeoutSec 5
    Write-Host "✅ $endpoint - Status: $($response.StatusCode)" -ForegroundColor Green
  } catch {
    Write-Host "❌ $endpoint - Error: $_" -ForegroundColor Red
  }
}
```

## 🎯 Shortcuts & Aliases

Aggiungi al tuo PowerShell profile (`$PROFILE`):

```powershell
# AI Studio shortcuts
function ai-start { npm run dev }
function ai-build { cd frontend; npm run build }
function ai-clean {
  Remove-Item -Recurse -Force frontend\node_modules, backend\node_modules
  Remove-Item frontend\package-lock.json, backend\package-lock.json
}
function ai-logs { Get-Content -Wait -Tail 50 backend.log }
```

---

**💡 Tips:**

- Usa `Get-Help <command>` per info su comandi PowerShell
- Usa `npm help <command>` per info su comandi npm
- Controlla sempre i logs per debug
- Testa localmente prima di deployare
- Fai backup regolari

**Happy Coding! 🚀**
