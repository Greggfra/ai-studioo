# 🎯 Guida Deploy - AI Studio

Questa guida ti aiuta a deployare AI Studio in produzione usando servizi gratuiti/economici.

## 📋 Architettura Consigliata

- **Frontend**: Vercel (gratuito)
- **Backend**: Render o Railway (tier gratuito)
- **Database**: Firebase (tier Spark gratuito)
- **Storage**: Firebase Storage (incluso)

---

## 🚀 Deploy Frontend su Vercel

### 1. Prepara il Progetto

Assicurati che il build funzioni localmente:

```bash
cd frontend
npm run build
```

### 2. Installa Vercel CLI

```bash
npm install -g vercel
```

### 3. Deploy

```bash
cd frontend
vercel
```

Segui la procedura:
- Login con GitHub/Email
- Setup project: Yes
- Which scope: your-account
- Link to existing project: No
- Project name: ai-studio
- Directory: `./` (già nella cartella frontend)
- Override settings: No

### 4. Configura Variabili d'Ambiente

Vai su [Vercel Dashboard](https://vercel.com/dashboard):

1. Seleziona il progetto
2. Settings → Environment Variables
3. Aggiungi:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
VITE_API_URL=https://your-backend.onrender.com/api
```

### 5. Redeploy

```bash
vercel --prod
```

Il tuo frontend sarà live su: `https://ai-studio.vercel.app`

---

## 🖥️ Deploy Backend su Render

### 1. Crea Account

Vai su [Render](https://render.com/) e crea un account gratuito.

### 2. Nuovo Web Service

1. Dashboard → New → Web Service
2. Connetti il repository GitHub
3. Oppure usa "Public Git repository" con l'URL

### 3. Configurazione

- **Name**: ai-studio-backend
- **Environment**: Node
- **Region**: Frankfurt (EU) o più vicino
- **Branch**: main
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: Free

### 4. Variabili d'Ambiente

Nella sezione "Environment":

```
NODE_ENV=production
PORT=10000
OPENAI_API_KEY=sk-your_openai_key
```

Per `serviceAccountKey.json`, hai 2 opzioni:

**Opzione A: Variabile d'ambiente (consigliato)**

1. Converti il JSON in stringa:
```bash
# Linux/Mac
cat serviceAccountKey.json | tr -d '\n'

# Windows PowerShell
Get-Content serviceAccountKey.json -Raw | ForEach-Object { $_ -replace '\r?\n', '' }
```

2. Aggiungi variabile:
```
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
```

3. Aggiorna `backend/server.js`:
```javascript
import admin from 'firebase-admin';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY 
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
```

**Opzione B: File segreto**

Usa Render Secret Files (vedi docs).

### 5. Deploy

Clicca "Create Web Service" → Deploy automatico inizia.

Il backend sarà live su: `https://ai-studio-backend.onrender.com`

⚠️ **Importante**: Il tier gratuito di Render va in sleep dopo 15 min di inattività. Il primo request dopo sleep può richiedere 30-60 secondi.

---

## 🚂 Deploy Backend su Railway (Alternativa)

### 1. Crea Account

Vai su [Railway](https://railway.app/) e crea account con GitHub.

### 2. Nuovo Progetto

1. Dashboard → New Project
2. Deploy from GitHub repo
3. Seleziona il repository
4. Seleziona la cartella `backend`

### 3. Configurazione

Railway rileva automaticamente Node.js.

Aggiungi variabili:

```
NODE_ENV=production
OPENAI_API_KEY=sk-your_key
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
```

### 4. Custom Start Command

Settings → Start Command:
```
npm start
```

Railway genera automaticamente un dominio: `your-app.up.railway.app`

---

## 🔧 Configurazione Post-Deploy

### 1. Aggiorna Firebase

In Firebase Console → Authentication → Settings → Authorized domains:

Aggiungi:
- `ai-studio.vercel.app` (frontend)
- `your-backend.onrender.com` (se necessario)

### 2. Aggiorna CORS

In `backend/server.js`:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://ai-studio.vercel.app',
    'https://your-custom-domain.com'
  ],
  credentials: true
}));
```

Redeploy backend.

### 3. Testa l'App

Vai su `https://ai-studio.vercel.app`:

1. Registrati/Login
2. Prova la chat
3. Genera un'immagine
4. Verifica che tutto funzioni

---

## 🌐 Custom Domain (Opzionale)

### Vercel (Frontend)

1. Acquista dominio (Namecheap, GoDaddy, etc.)
2. Vercel Dashboard → Settings → Domains
3. Add Domain: `aistudio.com`
4. Configura DNS records come indicato
5. Vercel configura SSL automaticamente

### Render (Backend)

Custom domains disponibili solo nei piani a pagamento.

---

## 💰 Costi Stimati

### Tier Gratuito

- **Vercel**: 100GB bandwidth/mese, illimitati progetti
- **Render**: 750 ore/mese (sufficiente per 1 servizio 24/7), va in sleep
- **Railway**: $5/mese di crediti gratuiti
- **Firebase**: 50K reads, 20K writes/giorno
- **OpenAI**: Pay-as-you-go

### Upgrade Consigliati

Quando hai traffico:

- **Vercel Pro**: $20/mese (più bandwidth, analytics)
- **Render Starter**: $7/mese (no sleep, più risorse)
- **Firebase Blaze**: Pay-as-you-go (backup, più quota)
- **OpenAI**: Prepaid credits (sconti volume)

**Stima**: Con 1000 utenti attivi/mese:
- Hosting: ~$20-30/mese
- OpenAI API: ~$50-100/mese
- **Totale**: $70-130/mese

---

## 📊 Monitoraggio

### Vercel Analytics

Vai su Dashboard → Analytics per:
- Visitatori
- Tempo di caricamento
- Web Vitals

### Render Metrics

Dashboard → Metrics per:
- CPU usage
- Memory usage
- Request rate

### Firebase Usage

Console → Usage per:
- Firestore reads/writes
- Storage usage
- Auth users

### OpenAI Usage

Platform → Usage per:
- Token utilizzati
- Costi giornalieri
- Modelli più usati

---

## 🔒 Sicurezza in Produzione

### 1. Rate Limiting

Installa nel backend:

```bash
npm install express-rate-limit
```

In `backend/server.js`:

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuti
  max: 100, // max 100 requests per IP
  message: 'Troppi tentativi, riprova più tardi'
});

app.use('/api/', limiter);
```

### 2. Helmet Configuration

Già incluso, ma personalizza:

```javascript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
```

### 3. Environment Variables

**Mai** committare file `.env` o API keys!

Usa sempre variabili d'ambiente su Vercel/Render.

### 4. Firebase Rules

Usa le rules restrittive da `FIREBASE_SETUP.md`.

---

## 🐛 Troubleshooting Deploy

### Vercel Build Error

```
Error: Cannot find module 'X'
```

**Soluzione**: Aggiungi dipendenza in `package.json`, commit, push.

### Render Deploy Failed

Verifica logs in Dashboard → Logs.

**Problemi comuni**:
- Node version errata → Aggiungi in `package.json`:
  ```json
  "engines": {
    "node": "18.x"
  }
  ```
- Missing env vars → Verifica Environment Variables

### Backend Connection Failed

Controlla:
1. Backend è online (vai su URL backend/health)
2. CORS configurato correttamente
3. VITE_API_URL nel frontend punta a backend prod
4. Firewall/Network rules su Render

### Firebase Auth Error

Verifica:
1. Authorized domains include il dominio frontend
2. API keys corrette nelle env vars
3. serviceAccountKey configurato correttamente

---

## 📈 Ottimizzazioni

### Frontend

1. **Code Splitting**: Già implementato con React Router
2. **Image Optimization**: Usa Vercel Image Optimization
3. **Caching**: Configura headers in `vercel.json`

### Backend

1. **Database Connection Pooling**: Già gestito da Firebase
2. **Response Caching**: Implementa Redis (Upstash free tier)
3. **Compression**: Già abilitato con Express

---

## 🎉 Checklist Pre-Launch

- [ ] Frontend deployato e funzionante
- [ ] Backend deployato e risponde
- [ ] Firebase configurato con security rules
- [ ] Custom domain configurato (opzionale)
- [ ] SSL/HTTPS attivo (automatico Vercel/Render)
- [ ] Variabili d'ambiente configurate
- [ ] Rate limiting attivo
- [ ] Monitoraggio configurato
- [ ] Backup policy definita
- [ ] Testato flusso completo:
  - [ ] Registrazione
  - [ ] Login
  - [ ] Chat
  - [ ] Generazione immagine
  - [ ] Creazione presentazione

---

**Sei live! 🚀**

Condividi il tuo progetto, monitora l'utilizzo e scala quando necessario!
