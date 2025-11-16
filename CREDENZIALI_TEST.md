# 🔐 CREDENZIALI DI TEST - AI STUDIO

## 📧 Account Email/Password di Test

### Account Utente 1
- **Email**: test@aistudio.com
- **Password**: test123456
- **Nome**: Mario Rossi
- **Piano**: Free (100 crediti)

### Account Utente 2  
- **Email**: demo@aistudio.com
- **Password**: demo123456
- **Nome**: Demo User
- **Piano**: Free (100 crediti)

### Account Admin Test
- **Email**: admin@aistudio.com
- **Password**: admin123456
- **Nome**: Admin AI STUDIO
- **Piano**: Pro (1000 crediti)

## 🌐 Test Google OAuth
- Usa il tuo account Google personale per testare l'autenticazione OAuth
- Il sistema creerà automaticamente un profilo la prima volta che accedi

## 🔑 Firebase Configuration
```
Project ID: ai-studiooo
Auth Domain: ai-studiooo.firebaseapp.com
API Key: AIzaSyDIYiT2odSzABQ4123IfJWDJ6hmb76qkRo
```

## 🧪 Test Cases da Provare

### 1. Registrazione Nuovo Utente
- Vai su `/register`
- Usa email: `nuovotest@aistudio.com`
- Password: `testpass123`
- Nome: `Nuovo Utente`

### 2. Login con Credenziali Esistenti
- Usa uno degli account sopra
- Verifica redirect automatico alla dashboard

### 3. Test Protezione Route
- Prova ad accedere direttamente a `/app/dashboard` senza essere loggato
- Dovresti essere reindirizzato al login

### 4. Test Google OAuth
- Clicca "Continua con Google" su login/register
- Autorizza l'accesso con il tuo account Google

### 5. Test Reset Password
- Vai su `/forgot-password`  
- Inserisci una delle email di test
- Controlla la console Firebase per il link di reset

### 6. Test Logout
- Una volta loggato, clicca sul menu utente in alto a destra
- Seleziona "Logout"
- Verifica il redirect alla home page

## 💡 Note per il Testing

1. **Prima volta**: Gli account potrebbero non esistere ancora in Firebase, quindi registrali la prima volta
2. **Firebase Console**: Puoi monitorare gli utenti su https://console.firebase.google.com
3. **Local Storage**: L'auth state è salvato in localStorage per persistenza
4. **Errori comuni**: Controlla la console del browser per eventuali errori Firebase

## 🚀 Quick Test Script

1. Apri http://localhost:3000
2. Clicca "Registrati"
3. Crea account con: test@example.com / test123456
4. Verifica redirect a dashboard (/app/dashboard)
5. Testa il toggle tema (luna/sole)
6. Apri menu utente e fai logout
7. Login di nuovo con le stesse credenziali
8. Testa Google OAuth se disponibile

## ⚠️ Troubleshooting

- **Errore "Firebase not configured"**: Verifica che .env.local sia presente
- **Errore "User not found"**: L'account non esiste, registralo prima
- **Errore Google OAuth**: Assicurati che il dominio localhost sia autorizzato in Firebase Console
- **Pagina bianca**: Controlla la console per errori JavaScript

Buon testing! 🎉