# 🚀 Guida Rapida - Setup AI Studio

Questa guida ti porterà dall'installazione all'avvio dell'applicazione in **10 minuti**!

## ⚡ Setup Veloce (per iniziare subito)

### 1. Installa Dipendenze

```powershell
cd "c:\Users\Admin\Downloads\SIto\SITO AI\ai-studio"
npm run install:all
```

### 2. Configura Firebase (Obbligatorio)

#### Crea Progetto Firebase:
1. Vai su https://console.firebase.google.com/
2. Clicca "Aggiungi progetto"
3. Nome: `ai-studio` (o quello che preferisci)
4. Disabilita Google Analytics (opzionale)
5. Clicca "Crea progetto"

#### Abilita Autenticazione:
1. Menu laterale → **Authentication** → **Inizia**
2. Abilita:
   - ✅ **Email/Password** (clicca, poi Salva)
   - ✅ **Google** (clicca, inserisci email supporto, Salva)

#### Crea Firestore:
1. Menu laterale → **Firestore Database** → **Crea database**
2. Scegli **"Inizia in modalità test"**
3. Seleziona location: **europe-west3** (o più vicina)
4. Clicca **Abilita**

#### Ottieni Credenziali Frontend:
1. Impostazioni ⚙️ → **Impostazioni progetto**
2. Scorri a "Le tue app" → Clicca icona web `</>`
3. Nome app: `AI Studio Web`
4. ❌ NON selezionare Firebase Hosting
5. Clicca **Registra app**
6. **Copia** il blocco `firebaseConfig`

#### Ottieni Credenziali Backend:
1. Impostazioni ⚙️ → **Account di servizio**
2. Clicca **Genera nuova chiave privata**
3. Scarica il file JSON
4. Rinominalo in `serviceAccountKey.json`
5. Spostalo in `backend/serviceAccountKey.json`

### 3. Configura OpenAI (Obbligatorio per AI)

1. Vai su https://platform.openai.com/api-keys
2. Clicca **"Create new secret key"**
3. Nome: `AI Studio`
4. **Copia la chiave** (inizia con `sk-...`)
5. ⚠️ **Non perderla!** Non potrai vederla di nuovo

### 4. Crea File di Configurazione

#### Frontend `.env.local`

Crea il file `frontend/.env.local`:

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=ai-studio-xxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=ai-studio-xxx
VITE_FIREBASE_STORAGE_BUCKET=ai-studio-xxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
VITE_API_URL=http://localhost:5000/api
```

**Sostituisci i valori** con quelli copiati da Firebase!

#### Backend `.env`

Crea il file `backend/.env`:

```env
PORT=5000
NODE_ENV=development
OPENAI_API_KEY=sk-...tua_chiave_openai_qui
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
```

**Sostituisci** `sk-...` con la tua chiave OpenAI!

#### Aggiorna `frontend/src/config/firebase.js`

Apri `frontend/src/config/firebase.js` e sostituisci:

```javascript
export const firebaseConfig = {
  apiKey: "AIza...",  // Tua API Key
  authDomain: "ai-studio-xxx.firebaseapp.com",  // Tuo Auth Domain
  projectId: "ai-studio-xxx",  // Tuo Project ID
  storageBucket: "ai-studio-xxx.appspot.com",  // Tuo Storage Bucket
  messagingSenderId: "123456789",  // Tuo Sender ID
  appId: "1:123456789:web:abcdef",  // Tuo App ID
  measurementId: "G-XXXXXXXXXX"  // Opzionale
};
```

### 5. Avvia l'Applicazione

```powershell
npm run dev
```

Questo comando avvia **frontend** (porta 3000) e **backend** (porta 5000) insieme!

### 6. Apri il Browser

Vai su: **http://localhost:3000**

---

## ✅ Checklist Pre-Avvio

Prima di avviare, verifica:

- [ ] Hai creato il progetto Firebase
- [ ] Hai abilitato Email/Password e Google Auth
- [ ] Hai creato Firestore Database
- [ ] Hai scaricato `serviceAccountKey.json` in `backend/`
- [ ] Hai creato `frontend/.env.local` con le credenziali
- [ ] Hai creato `backend/.env` con la chiave OpenAI
- [ ] Hai aggiornato `frontend/src/config/firebase.js`
- [ ] Hai eseguito `npm run install:all`

---

## 🎯 Primo Utilizzo

### Registrazione

1. Clicca **"Registrati"**
2. Scegli:
   - **Email e Password**: Compila nome, email, password
   - **Google**: Login veloce con Google

### Test Funzionalità

**Chat AI:**
- Scrivi: "Ciao, come funzioni?"
- Prova: "/image un gatto spaziale"

**Editor Immagini:**
- Sidebar → **Editor Immagini**
- Descrizione: "Un tramonto colorato su una spiaggia"
- Clicca **Genera**

**Editor Presentazioni:**
- Sidebar → **Presentazioni**
- Argomento: "Intelligenza Artificiale"
- Clicca **Genera**

---

## 🐛 Problemi Comuni

### Errore: "Invalid API Key" (OpenAI)

**Causa**: Chiave OpenAI mancante o errata

**Soluzione**:
1. Verifica che `backend/.env` contenga `OPENAI_API_KEY=sk-...`
2. Controlla su https://platform.openai.com/account/usage che hai crediti
3. Riavvia il backend

### Errore: "Firebase: Error (auth/...)"

**Causa**: Configurazione Firebase errata

**Soluzione**:
1. Verifica `frontend/.env.local` e `frontend/src/config/firebase.js`
2. Assicurati che Email/Password e Google siano abilitati in Firebase Console
3. Riavvia il frontend

### Porta 3000 o 5000 già in uso

**Soluzione Windows**:
```powershell
# Trova processo sulla porta
netstat -ano | findstr :3000

# Termina processo (sostituisci PID)
taskkill /PID <PID> /F
```

**Alternativa**: Cambia porta in `vite.config.js` o `backend/server.js`

### Moduli non trovati

```powershell
# Frontend
cd frontend
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install

# Backend
cd ../backend
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

---

## 💡 Tips & Tricks

### Usa GPT-3.5 per risparmiare (Test)

In `backend/routes/chat.js`, cambia:

```javascript
model: 'gpt-3.5-turbo',  // Invece di 'gpt-4'
```

GPT-3.5 è molto più economico!

### Tema Scuro Predefinito

In `frontend/src/store/index.js`, cambia:

```javascript
theme: 'dark',  // Invece di 'light'
```

### Aumenta Crediti Gratuiti

In `backend/routes/chat.js` (o quando crei utenti), cambia:

```javascript
credits: 1000,  // Invece di 100
```

---

## 🚀 Prossimi Passi

Una volta che tutto funziona:

1. **Personalizza**: Cambia colori, logo, testi
2. **Testa**: Prova tutte le funzionalità
3. **Deploya**: Usa Vercel (frontend) e Render (backend)
4. **Monetizza**: Aggiungi piani Premium con Stripe

---

## 📞 Hai bisogno di aiuto?

- Controlla `README.md` per documentazione completa
- Verifica la sezione **Troubleshooting**
- Controlla i log del terminale per errori dettagliati

**Buon lavoro! 🎉**
