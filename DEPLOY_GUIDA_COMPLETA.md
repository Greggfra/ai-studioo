# 🚀 GUIDA COMPLETA AL DEPLOY - AI STUDIO

## 📋 COSA SERVE

✅ Account GitHub (hai già)
✅ Account Vercel (gratis - collegalo a GitHub)
✅ Chiave API Groq (hai già)
✅ Configurazione Firebase (hai già)

---

## 🎯 PASSO 1: CARICA SU GITHUB (5 minuti)

### Opzione A: Interfaccia Web (PIÙ SEMPLICE)

1. **Vai su https://github.com/new**
   - Repository name: `ai-studio`
   - Description: `AI Studio - Chat, Immagini, Video, Presentazioni`
   - Visibilità: `Public` o `Private` (a tua scelta)
   - ❌ NON inizializzare con README, .gitignore o license
   - Clicca "Create repository"

2. **Carica i file:**
   - Clicca "uploading an existing file"
   - Trascina TUTTA la cartella `ai-studio` (escludi `node_modules`)
   - Aggiungi commit message: "Initial commit - AI Studio"
   - Clicca "Commit changes"

### Opzione B: Con Git Desktop (ALTERNATIVA)

1. Scarica GitHub Desktop: https://desktop.github.com
2. Installa e accedi con il tuo account GitHub
3. File → Add Local Repository → Scegli `C:\Users\Admin\Downloads\SIto\SITO AI\ai-studio`
4. Pubblica su GitHub

---

## 🎯 PASSO 2: DEPLOY BACKEND SU VERCEL (3 minuti)

1. **Vai su https://vercel.com**
   - Sign up con GitHub
   - Autorizza Vercel ad accedere ai tuoi repository

2. **Importa il progetto:**
   - Clicca "Add New..." → "Project"
   - Seleziona il repository `ai-studio`
   - Clicca "Import"

3. **Configurazione Backend:**
   - **Project Name**: `ai-studio-backend`
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Output Directory**: `.` (lascia com'è)
   - **Install Command**: `npm install`

4. **Environment Variables (IMPORTANTE!):**
   Clicca "Environment Variables" e aggiungi:

   ```
   GROQ_API_KEY = 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
   PORT = 5000
   NODE_ENV = production
   ```

5. **Deploy:**
   - Clicca "Deploy"
   - Aspetta 2-3 minuti
   - **COPIA L'URL** che ti viene dato (es: `https://ai-studio-backend.vercel.app`)

---

## 🎯 PASSO 3: DEPLOY FRONTEND SU VERCEL (3 minuti)

1. **Torna su Vercel Dashboard**
   - Clicca "Add New..." → "Project"
   - Seleziona di nuovo `ai-studio`

2. **Configurazione Frontend:**
   - **Project Name**: `ai-studio`
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Environment Variables (IMPORTANTE!):**
   Aggiungi queste variabili:

   ```
   VITE_API_URL = [URL del backend dal PASSO 2]
   VITE_FIREBASE_API_KEY = AIzaSyCd6A6dFKbdL0OFh9fPFYF_FLNX0ljKuzY
   VITE_FIREBASE_AUTH_DOMAIN = ai-studio-c63a3.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID = ai-studio-c63a3
   VITE_FIREBASE_STORAGE_BUCKET = ai-studio-c63a3.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID = 1076048965906
   VITE_FIREBASE_APP_ID = 1:1076048965906:web:e2ff1a75b4e00d59c8a5cf
   ```

4. **Deploy:**
   - Clicca "Deploy"
   - Aspetta 1-2 minuti
   - **RICEVI IL TUO LINK PUBBLICO!** 🎉

---

## 🎯 PASSO 4: COLLEGA BACKEND AL FRONTEND

1. **Vai nel progetto Frontend su Vercel**
   - Settings → Environment Variables
   - Trova `VITE_API_URL`
   - Cambia il valore con l'URL del backend (dal PASSO 2)
   - Clicca "Save"

2. **Redeploy:**
   - Vai su "Deployments"
   - Clicca sui tre puntini dell'ultimo deploy
   - Clicca "Redeploy"

---

## ✅ FATTO!

Il tuo AI Studio è LIVE! 🎉

**Link pubblico:** `https://ai-studio.vercel.app` (o il nome che hai scelto)

### Funzionalità disponibili:
- ✅ Chat AI con Groq (Llama 3.3 70B)
- ✅ Generazione Immagini (Pollinations.ai)
- ✅ Video AI (modalità demo)
- ✅ Presentazioni AI
- ✅ Salvataggio e cronologia
- ✅ Autenticazione Firebase
- ✅ Editor di immagini con disegni

---

## 🔧 AGGIORNAMENTI FUTURI

Quando fai modifiche al codice:

1. Carica i file aggiornati su GitHub
2. Vercel fa il redeploy automaticamente!
3. In 1-2 minuti le modifiche sono online

---

## 🆘 PROBLEMI COMUNI

**Backend non risponde:**
- Verifica che `GROQ_API_KEY` sia impostata
- Controlla i logs su Vercel → Backend Project → Logs

**Frontend non si connette al backend:**
- Verifica che `VITE_API_URL` punti all'URL corretto del backend
- Fai un redeploy del frontend

**Firebase non funziona:**
- Verifica che tutte le variabili Firebase siano corrette
- Vai su Firebase Console → Authentication → Settings
- Aggiungi il dominio Vercel agli "Authorized domains"

---

## 📱 CONDIVIDI IL TUO LINK!

Ora puoi condividere `https://ai-studio.vercel.app` con chiunque! 🚀
