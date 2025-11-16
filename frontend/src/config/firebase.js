// Firebase Configuration
// Legge le credenziali dalle variabili d'ambiente (.env.local)

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Backend API URL
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// OpenAI API Key (se vuoi usarla dal frontend - NON CONSIGLIATO in produzione)
export const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';
