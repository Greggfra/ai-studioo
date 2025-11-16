import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, RefreshCw, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { auth, authService } from '../services/firebase';
import { useAuthStore } from '../store';
import { sendEmailVerification, reload } from 'firebase/auth';
import toast, { Toaster } from 'react-hot-toast';

const EmailVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  
  const email = location.state?.email || user?.email || '';

  // Check verification status periodically
  useEffect(() => {
    let interval;
    
    if (user && !user.emailVerified) {
      interval = setInterval(async () => {
        try {
          await reload(user);
          if (user.emailVerified) {
            setIsVerified(true);
            toast.success('Email verificata con successo!');
            clearInterval(interval);
            setTimeout(() => {
              navigate('/app/dashboard');
            }, 2000);
          }
        } catch (error) {
          console.error('Error checking verification:', error);
        }
      }, 3000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [user, navigate]);

  const handleResendEmail = async () => {
    if (!user) {
      toast.error('Utente non trovato. Prova a registrarti nuovamente.');
      return;
    }

    setResending(true);
    try {
      await sendEmailVerification(user, {
        url: window.location.origin + '/login',
        handleCodeInApp: false
      });
      toast.success('Email di verifica inviata nuovamente!');
    } catch (error) {
      console.error('Resend verification error:', error);
      let errorMessage = 'Errore durante l\'invio dell\'email';
      
      if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Troppi tentativi. Riprova più tardi.';
      }
      
      toast.error(errorMessage);
    } finally {
      setResending(false);
    }
  };

  const handleCheckVerification = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await reload(user);
      if (user.emailVerified) {
        setIsVerified(true);
        toast.success('Email verificata con successo!');
        setTimeout(() => {
          navigate('/app/dashboard');
        }, 2000);
      } else {
        toast.error('Email non ancora verificata. Controlla la tua casella email.');
      }
    } catch (error) {
      console.error('Check verification error:', error);
      toast.error('Errore durante il controllo della verifica');
    } finally {
      setLoading(false);
    }
  };

  if (isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Email Verificata!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Reindirizzamento alla dashboard in corso...
          </p>
          <div className="flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-12">
      <Toaster position="top-center" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Back to Home */}
        <div className="text-center mb-4">
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
          >
            ← Torna alla Home
          </Link>
        </div>

        {/* Back Button */}
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Torna al login
        </Link>

        {/* Logo */}
        <div className="text-center mb-8">
          <motion.h1 
            className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            AI STUDIO
          </motion.h1>
          <p className="text-gray-600 dark:text-gray-400">
            Verifica la tua email
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
              Controlla la tua email
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Ti abbiamo inviato un codice di verifica all'indirizzo:
            </p>
            <p className="font-medium text-blue-600 dark:text-blue-400 mb-6">
              {email}
            </p>
          </div>

          {/* Instructions */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              📧 Istruzioni:
            </h3>
            <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>1. Controlla la tua casella email</li>
              <li>2. Cerca l'email da AI STUDIO</li>
              <li>3. Clicca sul link di verifica</li>
              <li>4. Torna qui per accedere</li>
            </ol>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <button
              onClick={handleCheckVerification}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Controllo in corso...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Ho verificato la mia email
                </>
              )}
            </button>

            <button
              onClick={handleResendEmail}
              disabled={resending}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Invio in corso...
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  Invia nuovamente
                </>
              )}
            </button>
          </div>

          {/* Help */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              💡 Non trovi l'email? Controlla la cartella spam
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Hai problemi?{' '}
              <a 
                href="mailto:support@aistudio.com" 
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Contatta il supporto
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EmailVerification;