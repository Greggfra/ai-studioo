import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, MessageSquare, Image, Video, Presentation, Download, ExternalLink, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const History = () => {
  const [historyItems, setHistoryItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    try {
      // Load only chat history
      const chatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
      
      // Map to include type, icon and color
      const combined = chatHistory.map(item => ({ 
        ...item, 
        type: 'chat', 
        icon: MessageSquare, 
        color: 'text-blue-500' 
      })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      setHistoryItems(combined);
    } catch (error) {
      console.error('Error loading history:', error);
      toast.error('Errore caricamento cronologia');
    }
  };

  const deleteItem = (id, type) => {
    try {
      let storageKey = 'chatHistory';
      if (type === 'image') storageKey = 'imageHistory';
      if (type === 'video') storageKey = 'videoHistory';
      
      const history = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const filtered = history.filter(item => item.id !== id);
      localStorage.setItem(storageKey, JSON.stringify(filtered));
      
      loadHistory();
      toast.success('Elemento eliminato');
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Errore durante l\'eliminazione');
    }
  };

  const downloadImage = async (imageUrl, prompt) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${prompt.substring(0, 30).replace(/[^a-z0-9]/gi, '-')}.png`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success('Download avviato!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Errore durante il download');
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minuto' : 'minuti'} fa`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'ora' : 'ore'} fa`;
    if (diffDays === 1) return 'Ieri';
    if (diffDays < 7) return `${diffDays} giorni fa`;
    
    return date.toLocaleDateString('it-IT');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Clock className="w-8 h-8" />
            Cronologia
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Le tue conversazioni recenti
          </p>
        </div>

        <div className="space-y-3">
          {historyItems.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Nessun elemento nella cronologia</p>
              <p className="text-sm mt-2">Le tue creazioni appariranno qui</p>
            </div>
          ) : (
            historyItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="card hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    {/* Icon or Image Preview */}
                    {item.type === 'image' && item.imageUrl ? (
                      <img 
                        src={item.imageUrl} 
                        alt={item.prompt}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                    ) : (
                      <div className={`w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center ${item.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">
                        {item.prompt || item.title || item.message}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(item.timestamp)}
                      </p>
                      {item.type === 'image' && (
                        <span className="text-xs text-purple-500 font-medium">
                          Immagine AI
                        </span>
                      )}
                      {item.type === 'video' && (
                        <span className="text-xs text-red-500 font-medium">
                          Video AI • {item.duration || 3}s
                        </span>
                      )}
                      {item.type === 'chat' && item.messageCount && (
                        <span className="text-xs text-blue-500 font-medium">
                          {item.messageCount} messaggi
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {item.type === 'chat' && (
                        <button
                          onClick={() => navigate('/app/dashboard', { state: { chatId: item.id } })}
                          className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        >
                          Apri Chat
                        </button>
                      )}
                      <button
                        onClick={() => deleteItem(item.id, item.type)}
                        className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        Elimina
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default History;
