# 🚀 AI Studio

**AI Studio** è una piattaforma completa che combina Chat AI, Editor Immagini, Editor Video ed Editor Presentazioni in un'unica applicazione moderna e intuitiva.

![AI Studio](https://img.shields.io/badge/AI-Studio-blue)
![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![Firebase](https://img.shields.io/badge/Firebase-Auth-orange?logo=firebase)

## ✨ Funzionalità Principali

### 🔐 Autenticazione
- ✅ Registrazione con email e password
- ✅ Login con Google OAuth
- ✅ Recupero password
- ✅ Gestione sessioni sicure con Firebase
- ✅ Protezione rotte private

### 💬 Chat AI
- Interfaccia stile ChatGPT
- Supporto Markdown e syntax highlighting
- Comandi rapidi (`/image`, `/video`, `/slides`)
- Storico conversazioni
- Tema chiaro/scuro

### 🎨 Editor Immagini AI
- Generazione immagini da testo (DALL-E 3)
- Strumenti di editing: pennello, gomma
- Filtri e regolazioni
- Inpainting e outpainting
- Esportazione PNG/JPG

### 🎬 Editor Video AI
- Generazione video da testo
- Taglio e unione clip
- Aggiunta sottotitoli automatici
- Inserimento musica di sottofondo
- Preview in tempo reale
- Esportazione MP4

### 📊 Editor Presentazioni AI
- Generazione slide da argomento
- 4 template professionali
- Editor drag & drop
- Modalità presentazione fullscreen
- Esportazione PDF/PPTX

## 🛠️ Stack Tecnologico

### Frontend
- **React 18** - Framework UI
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Framer Motion** - Animazioni
- **Zustand** - State management
- **Firebase** - Autenticazione e database
- **React Router** - Routing
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **OpenAI API** - GPT-4, DALL-E 3
- **Firebase Admin** - Server-side auth
- **Helmet** - Security
- **Morgan** - Logging

## 📋 Prerequisiti

Prima di iniziare, assicurati di avere installato:

- **Node.js** (v18 o superiore)
- **npm** o **yarn**
- Account **Firebase** (gratuito)
- **OpenAI API Key** (richiede crediti)

## 🚀 Installazione

### 1️⃣ Clona il Repository

```bash
cd "c:\Users\Admin\Downloads\SIto\SITO AI\ai-studio"
```

### 2️⃣ Installa le Dipendenze

```bash
npm run install:all
```

Oppure manualmente:

```bash
# Root
npm install

# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 3️⃣ Configura Firebase

#### A. Crea un Progetto Firebase

1. Vai su [Firebase Console](https://console.firebase.google.com/)
2. Clicca su **"Aggiungi progetto"**
3. Segui la procedura guidata

#### B. Configura l'Autenticazione

1. Nel menu laterale, vai su **"Authentication"**
2. Clicca su **"Inizia"**
3. Abilita:
   - **Email/Password**
   - **Google** (segui la configurazione OAuth)

#### C. Crea Firestore Database

1. Nel menu laterale, vai su **"Firestore Database"**
2. Clicca su **"Crea database"**
3. Scegli modalità **"test"** per iniziare
4. Seleziona una region (es: `europe-west1`)

#### D. Ottieni le Credenziali

**Per il Frontend:**

1. Vai su **"Impostazioni progetto"** (icona ingranaggio)
2. Scorri fino a **"Le tue app"**
3. Clicca sull'icona web `</>`
4. Copia la configurazione Firebase

**Per il Backend:**

1. Vai su **"Impostazioni progetto" → "Account di servizio"**
2. Clicca su **"Genera nuova chiave privata"**
3. Salva il file JSON come `serviceAccountKey.json` nella cartella `backend`

### 4️⃣ Configura OpenAI API

1. Vai su [OpenAI Platform](https://platform.openai.com/)
2. Crea un account (se non ce l'hai)
3. Vai su **"API Keys"**
4. Clicca **"Create new secret key"**
5. Copia la chiave (inizia con `sk-...`)

### 5️⃣ Configura le Variabili d'Ambiente

#### Frontend

Crea il file `frontend/.env.local`:

```env
VITE_FIREBASE_API_KEY=tua_api_key
VITE_FIREBASE_AUTH_DOMAIN=tuo-progetto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tuo-progetto-id
VITE_FIREBASE_STORAGE_BUCKET=tuo-progetto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

VITE_API_URL=http://localhost:5000/api
```

Aggiorna anche `frontend/src/config/firebase.js` con i tuoi valori.

#### Backend

Crea il file `backend/.env`:

```env
PORT=5000
NODE_ENV=development

OPENAI_API_KEY=sk-...tua_chiave_openai

FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
```

### 6️⃣ Avvia l'Applicazione

#### Opzione 1: Avvio Combinato (Consigliato)

Dalla cartella root:

```bash
npm run dev
```

Questo avvierà sia frontend che backend contemporaneamente.

#### Opzione 2: Avvio Separato

**Frontend** (in un terminale):

```bash
cd frontend
npm run dev
```

**Backend** (in un altro terminale):

```bash
cd backend
npm run dev
```

### 7️⃣ Accedi all'Applicazione

Apri il browser e vai su:

```
http://localhost:3000
```

## 📖 Utilizzo

### Primo Accesso

1. Vai su **Registrati**
2. Scegli:
   - **Email e password** → Compila il form
   - **Google** → Login con account Google
3. Verrai reindirizzato alla Dashboard

### Chat AI

1. Digita un messaggio nella chat
2. Usa i comandi rapidi:
   - `/image descrizione` → Apre l'editor immagini
   - `/video descrizione` → Apre l'editor video
   - `/slides argomento` → Apre l'editor presentazioni

### Generare Immagini

1. Vai su **"Editor Immagini"** dalla sidebar
2. Descrivi l'immagine che vuoi (es: "Un gatto astronauta nello spazio")
3. Clicca **"Genera"**
4. Usa gli strumenti per modificare l'immagine
5. Clicca **"Scarica"** per salvare

### Creare Video

1. Vai su **"Editor Video"**
2. Descrivi il video (es: "Timelapse di un tramonto sul mare")
3. Scegli la durata
4. Clicca **"Genera Video"**
5. Attendi l'elaborazione (2-5 minuti)
6. Scarica il risultato

### Creare Presentazioni

1. Vai su **"Presentazioni"**
2. Inserisci l'argomento (es: "Introduzione all'AI")
3. Scegli un template
4. Clicca **"Genera"**
5. Modifica le slide generate
6. Esporta in PDF

## 🔧 Configurazione Avanzata

### Firestore Security Rules

Configura le regole di sicurezza in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Conversations
    match /conversations/{conversationId} {
      allow read, write: if request.auth != null && 
                           request.auth.uid == resource.data.userId;
      
      match /messages/{messageId} {
        allow read, write: if request.auth != null;
      }
    }
    
    // Projects
    match /projects/{projectId} {
      allow read, write: if request.auth != null && 
                           request.auth.uid == resource.data.userId;
    }
  }
}
```

### Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Limiti API OpenAI

Per gestire i costi, puoi:

1. Impostare limiti di spesa nella dashboard OpenAI
2. Implementare rate limiting nel backend
3. Usare modelli meno costosi per testing (es: `gpt-3.5-turbo`)

## 🐛 Troubleshooting

### Errore: "Invalid API Key"

- Verifica che la chiave OpenAI sia corretta in `backend/.env`
- Assicurati che la chiave inizi con `sk-`
- Controlla di avere crediti disponibili su OpenAI

### Errore Firebase: "Auth domain not whitelisted"

1. Vai su Firebase Console → Authentication → Settings
2. In "Authorized domains", aggiungi `localhost`

### Errore: "Module not found"

```bash
# Reinstalla le dipendenze
cd frontend && npm install
cd ../backend && npm install
```

### Port già in uso

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Oppure cambia porta in vite.config.js o backend server.js
```

## 📦 Build per Produzione

### Frontend

```bash
cd frontend
npm run build
```

I file verranno generati in `frontend/dist/`

### Deploy

**Vercel (Frontend):**

1. Installa Vercel CLI: `npm i -g vercel`
2. Nella cartella `frontend`: `vercel`
3. Segui la procedura guidata

**Render/Railway (Backend):**

1. Connetti il repository
2. Configura le variabili d'ambiente
3. Deploy automatico

## 🎨 Personalizzazione

### Colori

Modifica `frontend/tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#TUO_COLORE',
        // ...
      }
    }
  }
}
```

### Logo

Sostituisci il logo in `frontend/public/` e aggiorna i riferimenti.

## 🤝 Contribuire

Contributi, issues e feature requests sono benvenuti!

## 📄 Licenza

Questo progetto è rilasciato sotto licenza MIT.

## 🙏 Ringraziamenti

- OpenAI per le API GPT-4 e DALL-E 3
- Firebase per auth e database
- Vercel per l'hosting

## 📧 Supporto

Per domande o supporto:
- Email: support@aistudio.com
- GitHub Issues: [Crea un issue](https://github.com/tuousername/ai-studio/issues)

---

**Buon coding! 🚀**

*Fatto con ❤️ da Claude & GitHub Copilot*
