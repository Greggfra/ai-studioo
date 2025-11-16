# Configurazione Firebase per AI Studio

## Firestore Security Rules

Vai su Firebase Console → Firestore Database → Rules e incolla:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function - user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function - user owns the resource
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Users collection
    match /users/{userId} {
      // Users can read and write only their own data
      allow read, write: if isOwner(userId);
      
      // Allow user creation during registration
      allow create: if isAuthenticated();
    }
    
    // Conversations collection
    match /conversations/{conversationId} {
      // Only owner can access their conversations
      allow read, write: if isAuthenticated() && 
                           resource.data.userId == request.auth.uid;
      
      // Allow creation for authenticated users
      allow create: if isAuthenticated();
      
      // Messages subcollection
      match /messages/{messageId} {
        // Only owner of parent conversation can access messages
        allow read, write: if isAuthenticated() &&
                             get(/databases/$(database)/documents/conversations/$(conversationId)).data.userId == request.auth.uid;
      }
    }
    
    // Projects collection (images, videos, presentations)
    match /projects/{projectId} {
      // Only owner can access their projects
      allow read, write: if isAuthenticated() && 
                           resource.data.userId == request.auth.uid;
      
      // Allow creation for authenticated users
      allow create: if isAuthenticated();
    }
    
    // Deny all other requests
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Firebase Storage Rules

Vai su Firebase Console → Storage → Rules e incolla:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Helper function - check file size (max 10MB)
    function isValidSize() {
      return request.resource.size <= 10 * 1024 * 1024;
    }
    
    // Helper function - check image type
    function isImage() {
      return request.resource.contentType.matches('image/.*');
    }
    
    // Helper function - check video type
    function isVideo() {
      return request.resource.contentType.matches('video/.*');
    }
    
    // User uploads
    match /users/{userId}/{allPaths=**} {
      // Users can read and write only their own files
      allow read, write: if request.auth != null && 
                           request.auth.uid == userId &&
                           isValidSize();
    }
    
    // Project images
    match /projects/images/{userId}/{imageId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                     request.auth.uid == userId &&
                     isImage() &&
                     isValidSize();
    }
    
    // Project videos
    match /projects/videos/{userId}/{videoId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                     request.auth.uid == userId &&
                     isVideo() &&
                     request.resource.size <= 50 * 1024 * 1024; // Max 50MB for videos
    }
    
    // Presentations
    match /projects/presentations/{userId}/{presentationId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                     request.auth.uid == userId &&
                     isValidSize();
    }
    
    // Deny all other requests
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

## Firestore Indexes

Per query ottimizzate, crea questi indici compositi:

### Conversations Index

```
Collection: conversations
Fields:
  - userId (Ascending)
  - updatedAt (Descending)
```

### Projects Index

```
Collection: projects
Fields:
  - userId (Ascending)
  - type (Ascending)
  - updatedAt (Descending)
```

### Come creare gli indici:

1. Vai su Firestore Database → Indexes
2. Clicca "Crea indice"
3. Seleziona la collection
4. Aggiungi i campi nell'ordine indicato
5. Clicca "Crea"

Gli indici si creano automaticamente anche quando Firebase rileva query che li richiedono.

## Configurazione Autenticazione

### Providers

Vai su Authentication → Sign-in method e abilita:

1. **Email/Password**
   - Abilita: Sì
   - Email link: No (opzionale)

2. **Google**
   - Abilita: Sì
   - Nome pubblico: "AI Studio"
   - Email supporto: tua-email@esempio.com
   - Autorizza domini: localhost, il-tuo-dominio.com

### Domini Autorizzati

Vai su Authentication → Settings → Authorized domains:

- localhost (per sviluppo)
- il-tuo-dominio.com (per produzione)
- your-app.vercel.app (se usi Vercel)

### Templates Email

Vai su Authentication → Templates per personalizzare:

- Email di verifica
- Reset password
- Cambio email

## Firebase Emulator (Sviluppo Locale)

Per testare senza usare il database reale:

```bash
npm install -g firebase-tools
firebase login
firebase init emulators
```

Seleziona:
- [x] Authentication
- [x] Firestore
- [x] Storage

Poi avvia:

```bash
firebase emulators:start
```

E aggiorna `frontend/src/config/firebase.js`:

```javascript
// Usa gli emulatori in sviluppo
if (window.location.hostname === 'localhost') {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectStorageEmulator(storage, 'localhost', 9199);
}
```

## Monitoraggio Quota

Firebase ha limiti gratuiti:

- **Firestore**: 50K reads/day, 20K writes/day
- **Storage**: 5GB storage, 1GB/day download
- **Auth**: Unlimited

Vai su Usage → Usage and billing per monitorare.

## Backup

### Backup Manuale

Vai su Firestore Database → Import/Export:

1. Clicca "Export"
2. Seleziona collections
3. Scegli bucket Storage
4. Clicca "Export"

### Backup Automatico (Richiede Blaze Plan)

Usa Cloud Scheduler per backup automatici giornalieri.

## Best Practices

1. **Mai** esporre `serviceAccountKey.json` pubblicamente
2. Usa regole di sicurezza restrittive
3. Valida i dati lato client E server
4. Implementa rate limiting per evitare abusi
5. Monitora usage per evitare costi imprevisti
6. Usa indici per query complesse
7. Esegui backup regolari

## Troubleshooting

### "Permission denied"

Verifica le Security Rules - l'utente deve essere autenticato e autorizzato.

### "Index not found"

Clicca sul link nell'errore → crea l'indice automaticamente.

### "Quota exceeded"

Controlla Usage → passa a Blaze plan o ottimizza le query.

### "Invalid configuration"

Verifica che tutte le API siano abilitate in Google Cloud Console.
