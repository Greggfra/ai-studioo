# 📦 PREPARAZIONE PER IL CARICAMENTO SU GITHUB

## ✅ COSA È STATO PREPARATO

1. ✅ `.gitignore` - Per evitare di caricare file inutili
2. ✅ `vercel.json` nel backend - Configurazione per Vercel
3. ✅ Variabili d'ambiente già configurate nel codice
4. ✅ Guida completa al deploy (`DEPLOY_GUIDA_COMPLETA.md`)

---

## 🚀 PROSSIMI PASSI (SEMPLICI!)

### STEP 1: Crea repository su GitHub (2 minuti)

1. Vai su: https://github.com/new
2. Nome repository: `ai-studio`
3. Descrizione: `AI Studio - Chat, Immagini, Video, Presentazioni con AI`
4. Seleziona: **Public** (o Private se preferisci)
5. ❌ **NON** spuntare "Add a README file"
6. ❌ **NON** spuntare "Add .gitignore"
7. Clicca **"Create repository"**

### STEP 2: Carica i file (3 minuti)

**Opzione A - Drag & Drop (PIÙ VELOCE):**

1. Dopo aver creato il repo, clicca "uploading an existing file"
2. Apri questa cartella nel File Explorer:
   ```
   C:\Users\Admin\Downloads\SIto\SITO AI\ai-studio
   ```
3. Seleziona TUTTI i file e cartelle TRANNE:
   - ❌ `node_modules` (dentro frontend)
   - ❌ `node_modules` (dentro backend)
   - ❌ `backend/serviceAccountKey.json`
4. Trascina i file nell'area di GitHub
5. Scrivi: "Initial commit - AI Studio"
6. Clicca "Commit changes"

**Opzione B - GitHub Desktop (ALTERNATIVA):**

1. Scarica: https://desktop.github.com
2. Installa e accedi
3. File → Add Local Repository
4. Scegli: `C:\Users\Admin\Downloads\SIto\SITO AI\ai-studio`
5. Clicca "Publish repository"

---

## 🌐 STEP 3: Deploy su Vercel (LEGGI LA GUIDA)

Apri il file: **`DEPLOY_GUIDA_COMPLETA.md`**

Segui i passi dal PASSO 2 in poi (il PASSO 1 l'hai già fatto!)

---

## 📝 FILE IMPORTANTI CREATI

- `DEPLOY_GUIDA_COMPLETA.md` - Guida passo-passo al deploy
- `backend/vercel.json` - Configurazione Vercel per backend
- `.gitignore` - File da escludere dal repository

---

## ⚠️ IMPORTANTE: VARIABILI D'AMBIENTE

Quando fai il deploy su Vercel, dovrai inserire:

### Backend:
```
GROQ_API_KEY=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
PORT=5000
NODE_ENV=production
```

### Frontend:
```
VITE_API_URL=[URL del backend che ti darà Vercel]
VITE_FIREBASE_API_KEY=AIzaSyCd6A6dFKbdL0OFh9fPFYF_FLNX0ljKuzY
VITE_FIREBASE_AUTH_DOMAIN=ai-studio-c63a3.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=ai-studio-c63a3
VITE_FIREBASE_STORAGE_BUCKET=ai-studio-c63a3.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1076048965906
VITE_FIREBASE_APP_ID=1:1076048965906:web:e2ff1a75b4e00d59c8a5cf
```

Tutte queste informazioni sono già nella **DEPLOY_GUIDA_COMPLETA.md**!

---

## 🎉 RISULTATO FINALE

Una volta completato, avrai:

✅ Il tuo AI Studio accessibile da qualsiasi browser
✅ Un link pubblico da condividere (es: `https://ai-studio.vercel.app`)
✅ Deploy automatici quando aggiorni il codice su GitHub
✅ Hosting GRATUITO sia per frontend che backend

---

## 💡 HAI BISOGNO DI AIUTO?

1. Leggi attentamente la `DEPLOY_GUIDA_COMPLETA.md`
2. Ogni passo è spiegato in dettaglio
3. Ci vogliono circa 10 minuti in totale
4. È più semplice di quanto sembri! 😊

**INIZIA DA QUI:** Crea il repository su GitHub come spiegato nello STEP 1!
