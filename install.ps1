# AI Studio - Script di Installazione Automatica
# Questo script installa tutte le dipendenze necessarie

Write-Host "🚀 AI Studio - Installazione Automatica" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "📦 Verifica Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Node.js non trovato!" -ForegroundColor Red
    Write-Host "   Scaricalo da: https://nodejs.org/" -ForegroundColor Red
    exit 1
} else {
    Write-Host "✅ Node.js $nodeVersion trovato" -ForegroundColor Green
}

Write-Host ""

# Root dependencies
Write-Host "📦 Installazione dipendenze root..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Errore nell'installazione root" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dipendenze root installate" -ForegroundColor Green

Write-Host ""

# Frontend dependencies
Write-Host "📦 Installazione dipendenze frontend..." -ForegroundColor Yellow
Set-Location frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Errore nell'installazione frontend" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Write-Host "✅ Dipendenze frontend installate" -ForegroundColor Green
Set-Location ..

Write-Host ""

# Backend dependencies
Write-Host "📦 Installazione dipendenze backend..." -ForegroundColor Yellow
Set-Location backend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Errore nell'installazione backend" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Write-Host "✅ Dipendenze backend installate" -ForegroundColor Green
Set-Location ..

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ Installazione completata!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Prossimi passi:" -ForegroundColor Cyan
Write-Host "   1. Configura Firebase (vedi QUICKSTART.md)" -ForegroundColor White
Write-Host "   2. Crea frontend/.env.local" -ForegroundColor White
Write-Host "   3. Crea backend/.env" -ForegroundColor White
Write-Host "   4. Esegui: npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "📖 Documentazione:" -ForegroundColor Cyan
Write-Host "   - README.md (completo)" -ForegroundColor White
Write-Host "   - QUICKSTART.md (guida rapida)" -ForegroundColor White
Write-Host ""
