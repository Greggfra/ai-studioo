import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useThemeStore, useAuthStore } from './store';
import { auth, authService } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Auth Pages
import Landing from './pages/LandingSimple';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import EmailVerification from './pages/EmailVerification';

// Protected Pages
import Layout from './components/Layout';
import Chat from './pages/Chat';
import ImageEditor from './pages/ImageEditor';
import VideoEditor from './pages/VideoEditor';
import PresentationEditor from './pages/PresentationEditor';
import History from './pages/History';
import Saved from './pages/Saved';
import Settings from './pages/Settings';

// Components
import PrivateRoute from './components/PrivateRoute';

function App() {
  const { theme } = useThemeStore();
  const { setUser, setUserData, setLoading } = useAuthStore();

  // Apply theme on mount and when it changes
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Initialize auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setLoading(true);
        
        if (user) {
          // User is signed in
          setUser(user);
          
          // Get additional user data from Firestore
          const userData = await authService.getUserData(user.uid);
          if (userData) {
            setUserData(userData);
          }
        } else {
          // User is signed out
          setUser(null);
          setUserData(null);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setUser(null);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [setUser, setUserData, setLoading]);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: theme === 'dark' ? '#1f2937' : '#fff',
            color: theme === 'dark' ? '#fff' : '#000',
          },
        }}
      />
      
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Landing />} />
        
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/email-verification" element={<EmailVerification />} />

        {/* Protected Routes */}
        <Route
          path="/app"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<Chat />} />
          <Route path="image-editor" element={<ImageEditor />} />
          <Route path="video-editor" element={<VideoEditor />} />
          <Route path="presentation-editor" element={<PresentationEditor />} />
          <Route path="history" element={<History />} />
          <Route path="saved" element={<Saved />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
