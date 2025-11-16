# Script di avvio AI Studio
Write-Host "Avvio AI Studio..." -ForegroundColor Cyan

# Termina processi esistenti
Write-Host "Chiusura processi esistenti..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# Avvia Backend
Write-Host "Avvio Backend (porta 5000)..." -ForegroundColor Green
$backendPath = Join-Path $PSScriptRoot "backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; npm start"
Start-Sleep -Seconds 5

# Avvia Frontend
Write-Host "Avvio Frontend (porta 3000)..." -ForegroundColor Green
$frontendPath = Join-Path $PSScriptRoot "frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm run dev"
Start-Sleep -Seconds 5

# Verifica
Write-Host "" 
Write-Host "Verifica server..." -ForegroundColor Cyan
$backend = Get-NetTCPConnection -LocalPort 5000 -State Listen -ErrorAction SilentlyContinue
$frontend = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue

if ($backend) {
    Write-Host "OK Backend attivo (porta 5000)" -ForegroundColor Green
} else {
    Write-Host "ERRORE Backend non attivo" -ForegroundColor Red
}

if ($frontend) {
    Write-Host "OK Frontend attivo (porta 3000)" -ForegroundColor Green
} else {
    Write-Host "ERRORE Frontend non attivo" -ForegroundColor Red
}

Write-Host ""
Write-Host "Apri il browser su: http://localhost:3000" -ForegroundColor Cyan
Start-Sleep -Seconds 2
Start-Process "http://localhost:3000"
