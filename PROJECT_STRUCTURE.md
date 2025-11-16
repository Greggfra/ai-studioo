# 📁 Struttura Progetto - AI Studio

```
ai-studio/
│
├── 📄 package.json                    # Root package (scripts per avvio combinato)
├── 📄 .gitignore                      # File da ignorare in Git
├── 📄 README.md                       # Documentazione principale completa
├── 📄 QUICKSTART.md                   # Guida setup rapido (10 min)
├── 📄 FIREBASE_SETUP.md               # Configurazione Firebase dettagliata
├── 📄 DEPLOY.md                       # Guida deploy produzione
├── 📄 CHANGELOG.md                    # Storico versioni
├── 📄 COMMANDS.md                     # Comandi utili
├── 📄 install.ps1                     # Script installazione PowerShell
│
├── 📁 frontend/                       # Applicazione React
│   ├── 📄 package.json                # Dipendenze frontend
│   ├── 📄 vite.config.js              # Configurazione Vite
│   ├── 📄 tailwind.config.js          # Configurazione TailwindCSS
│   ├── 📄 postcss.config.js           # Configurazione PostCSS
│   ├── 📄 .eslintrc.cjs               # Regole ESLint
│   ├── 📄 index.html                  # HTML principale
│   ├── 📄 .env.example                # Template variabili ambiente
│   │
│   ├── 📁 public/                     # File statici
│   │   └── vite.svg
│   │
│   └── 📁 src/                        # Codice sorgente
│       ├── 📄 main.jsx                # Entry point React
│       ├── 📄 App.jsx                 # Componente root + routing
│       ├── 📄 index.css               # Stili globali + Tailwind
│       │
│       ├── 📁 components/             # Componenti React riutilizzabili
│       │   ├── 📄 Layout.jsx          # Layout principale con outlet
│       │   ├── 📄 Sidebar.jsx         # Sidebar navigazione
│       │   ├── 📄 Navbar.jsx          # Barra superiore con menu utente
│       │   └── 📄 PrivateRoute.jsx    # Protezione rotte autenticate
│       │
│       ├── 📁 pages/                  # Pagine applicazione
│       │   ├── 📄 Login.jsx           # Pagina login
│       │   ├── 📄 Register.jsx        # Pagina registrazione
│       │   ├── 📄 ForgotPassword.jsx  # Recupero password
│       │   ├── 📄 Chat.jsx            # Chat AI principale
│       │   ├── 📄 ImageEditor.jsx     # Editor immagini AI
│       │   ├── 📄 VideoEditor.jsx     # Editor video AI
│       │   ├── 📄 PresentationEditor.jsx # Editor presentazioni
│       │   ├── 📄 History.jsx         # Cronologia progetti
│       │   └── 📄 Settings.jsx        # Impostazioni utente
│       │
│       ├── 📁 services/               # Servizi e API
│       │   ├── 📄 firebase.js         # Firebase SDK + helper functions
│       │   └── 📄 api.js              # Axios instance configurato
│       │
│       ├── 📁 store/                  # State management (Zustand)
│       │   └── 📄 index.js            # Tutti gli store (Auth, Theme, Chat, ecc.)
│       │
│       └── 📁 config/                 # Configurazioni
│           └── 📄 firebase.js         # Credenziali Firebase
│
├── 📁 backend/                        # Server Node.js + Express
│   ├── 📄 package.json                # Dipendenze backend
│   ├── 📄 server.js                   # Entry point server
│   ├── 📄 .env.example                # Template variabili ambiente
│   ├── 📄 serviceAccountKey.json      # Credenziali Firebase Admin (gitignored)
│   │
│   └── 📁 routes/                     # API Routes
│       ├── 📄 chat.js                 # POST /api/chat - Chat GPT-4
│       ├── 📄 image.js                # POST /api/image/generate - DALL-E 3
│       ├── 📄 video.js                # POST /api/video/generate - Video AI
│       └── 📄 presentation.js         # POST /api/presentation/generate - Slide AI
│
└── 📁 docs/                           # Documentazione extra (opzionale)
    └── screenshots/
```

## 📊 Statistiche Progetto

### File Creati
- **Frontend**: 17 file principali
- **Backend**: 5 file principali
- **Documentazione**: 6 file markdown
- **Configurazione**: 8 file config
- **Totale**: ~36 file

### Linee di Codice (stima)
- **Frontend**: ~3,500 righe
- **Backend**: ~800 righe
- **Documentazione**: ~2,000 righe
- **Totale**: ~6,300 righe

### Dipendenze
- **Frontend**: 16 dipendenze principali
- **Backend**: 8 dipendenze principali

## 🎯 File Chiave da Configurare

### Prima dell'Avvio

1. **`frontend/.env.local`**
   - Credenziali Firebase
   - URL backend API

2. **`frontend/src/config/firebase.js`**
   - Configurazione Firebase (backup di .env)

3. **`backend/.env`**
   - Chiave OpenAI API
   - Porta server
   - Path serviceAccountKey

4. **`backend/serviceAccountKey.json`**
   - Credenziali Firebase Admin
   - Scaricato da Firebase Console

## 📦 Cartelle Generate Automaticamente

Queste cartelle vengono create durante l'installazione o build:

```
frontend/
├── node_modules/        # Dipendenze npm
└── dist/                # Build produzione

backend/
└── node_modules/        # Dipendenze npm

logs/                    # Log file (opzionale)
backup/                  # Backup (opzionale)
```

## 🚫 File Ignorati (.gitignore)

```
node_modules/
.env
.env.local
serviceAccountKey.json
dist/
build/
*.log
.DS_Store
.vscode/
```

## 🔗 Collegamenti File Importanti

### Routing (Frontend)
```
App.jsx
  ├─ /login → Login.jsx
  ├─ /register → Register.jsx
  ├─ /forgot-password → ForgotPassword.jsx
  └─ / (Protected) → Layout.jsx
      ├─ /dashboard → Chat.jsx
      ├─ /image-editor → ImageEditor.jsx
      ├─ /video-editor → VideoEditor.jsx
      ├─ /presentation-editor → PresentationEditor.jsx
      ├─ /history → History.jsx
      └─ /settings → Settings.jsx
```

### API Endpoints (Backend)
```
server.js
  ├─ /health → Health check
  ├─ /api/chat → routes/chat.js
  ├─ /api/image → routes/image.js
  ├─ /api/video → routes/video.js
  └─ /api/presentation → routes/presentation.js
```

### State Management
```
store/index.js
  ├─ useAuthStore (user, userData, login/logout)
  ├─ useThemeStore (theme, toggleTheme)
  ├─ useChatStore (messages, conversations)
  ├─ useImageEditorStore (currentImage, tools)
  ├─ useVideoEditorStore (currentVideo, timeline)
  └─ usePresentationStore (slides, currentSlide)
```

## 📱 Flusso Autenticazione

```
1. User opens app → App.jsx
2. PrivateRoute checks auth → PrivateRoute.jsx
3. If not auth → redirect to /login → Login.jsx
4. User logs in → authService.login() → services/firebase.js
5. Success → setUser() → store/index.js (useAuthStore)
6. Redirect to /dashboard → Layout.jsx → Chat.jsx
```

## 🎨 Flusso UI

```
Layout.jsx (container)
  ├─ Sidebar.jsx (left navigation)
  ├─ Navbar.jsx (top bar)
  └─ <Outlet> (page content)
      └─ Chat.jsx / ImageEditor.jsx / etc.
```

## 🔄 Flusso API Call

```
Component (es: Chat.jsx)
  ↓ axios.post('/api/chat', data)
  ↓ Proxy Vite → http://localhost:5000
  ↓
Backend (server.js)
  ↓ /api/chat → routes/chat.js
  ↓ OpenAI API call
  ↓ Response
  ↓
Frontend receives response
  ↓ Update state (Zustand)
  ↓ UI re-renders
```

## 💾 Database Structure (Firebase)

```
Firestore Collections:
├─ users/
│   └─ {userId}/
│       ├─ uid
│       ├─ email
│       ├─ displayName
│       ├─ credits
│       └─ plan
│
├─ conversations/
│   └─ {conversationId}/
│       ├─ userId
│       ├─ title
│       ├─ createdAt
│       └─ messages/
│           └─ {messageId}/
│               ├─ role
│               ├─ content
│               └─ createdAt
│
└─ projects/
    └─ {projectId}/
        ├─ userId
        ├─ type (image/video/presentation)
        ├─ data
        └─ createdAt
```

## 🎯 Entry Points

- **Frontend Dev**: `npm run dev` → Vite → `http://localhost:3000`
- **Backend Dev**: `npm run dev` → Nodemon → `http://localhost:5000`
- **Combined**: `npm run dev` (root) → Entrambi contemporaneamente

## 📚 Documentazione Disponibile

1. **README.md** - Setup completo, troubleshooting, features
2. **QUICKSTART.md** - Setup rapido 10 minuti
3. **FIREBASE_SETUP.md** - Configurazione Firebase dettagliata
4. **DEPLOY.md** - Guida deploy su Vercel/Render
5. **CHANGELOG.md** - Storia versioni
6. **COMMANDS.md** - Comandi utili per sviluppo

## 🔧 Prossimi Step

1. Configurare Firebase (vedi QUICKSTART.md)
2. Installare dipendenze: `npm run install:all`
3. Creare file .env
4. Avviare app: `npm run dev`
5. Aprire browser: `http://localhost:3000`

---

**Il progetto è completo e pronto per l'uso! 🚀**
