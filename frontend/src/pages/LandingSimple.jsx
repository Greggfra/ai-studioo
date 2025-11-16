import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../store';

const Landing = () => {
  const { theme, toggleTheme } = useThemeStore();
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="p-6">
        <nav className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">AI</span>
            </div>
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">AI STUDIO</span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>
            
            <Link
              to="/login"
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Accedi
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Registrati
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            Crea Contenuti <span className="text-blue-600 dark:text-blue-400">Straordinari</span> con l'IA
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Genera presentazioni professionali, immagini uniche e video coinvolgenti 
            con il potere dell'intelligenza artificiale
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              to="/register"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Inizia Gratis
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 text-lg text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Accedi
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Strumenti Creativi Professionali</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Scopri le nostre tre potenti funzionalità per dare vita alle tue idee creative
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-pink-500 rounded-2xl flex items-center justify-center text-white mb-6">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Immagini AI</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Genera immagini straordinarie con l'intelligenza artificiale più avanzata
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center text-white mb-6">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Presentazioni</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Crea presentazioni professionali e coinvolgenti in pochi minuti
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center text-white mb-6">
                <span className="text-2xl">🎬</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Video</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Produci video di alta qualità con strumenti di editing innovativi
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Inizia la Tua Avventura Creativa
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Unisciti a migliaia di creatori che stanno già trasformando le loro idee in realtà con AI STUDIO
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
          >
            Inizia Gratis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">AI</span>
            </div>
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">AI STUDIO</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            &copy; 2024 AI STUDIO. Tutti i diritti riservati.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;