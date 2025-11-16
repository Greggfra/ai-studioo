import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from './components/AuthProvider';
import App from './App';
import './index.css';

// Aggiungi il tema iniziale
const theme = localStorage.getItem('theme-storage');
if (theme) {
  const { state } = JSON.parse(theme);
  if (state.theme === 'dark') {
    document.documentElement.classList.add('dark');
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
