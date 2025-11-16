import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import { Loader2 } from 'lucide-react';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">AI</span>
          </div>
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">AI STUDIO</h2>
          <p className="text-gray-600 dark:text-gray-400">Verifica autenticazione in corso...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Save intended destination and show notification
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/app/')) {
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
      import('react-hot-toast').then(({ default: toast }) => {
        toast.error('Accesso negato. Effettua il login per continuare.');
      });
    }
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
