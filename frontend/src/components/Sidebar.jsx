import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Image, 
  Video, 
  Presentation,
  Settings,
  Plus,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  History,
  Clock,
  Bookmark
} from 'lucide-react';
import { useChatStore } from '../store';
import toast from 'react-hot-toast';

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setMessages, messages } = useChatStore();
  const [recentChats, setRecentChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);

  const menuItems = [
    {
      icon: MessageSquare,
      label: 'Chat AI',
      path: '/app/dashboard',
      color: 'text-blue-500'
    },
    {
      icon: Image,
      label: 'Editor Immagini',
      path: '/app/image-editor',
      color: 'text-purple-500'
    },
    {
      icon: Video,
      label: 'Editor Video',
      path: '/app/video-editor',
      color: 'text-red-500'
    },
    {
      icon: Presentation,
      label: 'Presentazioni',
      path: '/app/presentation-editor',
      color: 'text-green-500'
    },
    {
      icon: History,
      label: 'Cronologia',
      path: '/app/history',
      color: 'text-orange-500'
    },
    {
      icon: Bookmark,
      label: 'Salvati',
      path: '/app/saved',
      color: 'text-yellow-500'
    },
    {
      icon: Settings,
      label: 'Impostazioni',
      path: '/app/settings',
      color: 'text-gray-500'
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Load recent chats from localStorage
  useEffect(() => {
    loadRecentChats();
    
    // Reload when localStorage changes
    const handleStorageChange = () => {
      loadRecentChats();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically
    const interval = setInterval(loadRecentChats, 2000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const loadRecentChats = () => {
    try {
      const chatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
      // Get last 5 chats
      setRecentChats(chatHistory.slice(0, 5));
    } catch (error) {
      console.error('Error loading recent chats:', error);
    }
  };

  const handleNewChat = () => {
    // Save current conversation if it has messages
    if (messages.length > 0 && currentChatId !== 'new') {
      saveCurrentChat();
    }
    
    // Clear messages
    setMessages([]);
    setCurrentChatId('new');
    
    // Navigate to chat
    navigate('/app/dashboard');
    toast.success('Nuova chat avviata!');
  };

  const saveCurrentChat = (isTemporary = false) => {
    try {
      const chatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
      const firstUserMessage = messages.find(m => m.role === 'user');
      const title = firstUserMessage?.content.substring(0, 50) || 'Conversazione';
      
      // Check if this chat already exists (updating existing)
      const existingIndex = currentChatId && currentChatId !== 'new' 
        ? chatHistory.findIndex(c => c.id === currentChatId)
        : -1;
      
      const chatEntry = {
        id: existingIndex >= 0 ? currentChatId : Date.now(),
        title: title,
        messages: messages,
        timestamp: new Date().toISOString(),
        messageCount: messages.length,
        type: 'chat',
        isTemporary: isTemporary
      };
      
      let updatedHistory;
      if (existingIndex >= 0) {
        // Update existing chat
        updatedHistory = [...chatHistory];
        updatedHistory[existingIndex] = chatEntry;
      } else {
        // Add new chat
        updatedHistory = [chatEntry, ...chatHistory];
      }
      
      // Keep only last 50
      updatedHistory = updatedHistory.slice(0, 50);
      
      localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
      loadRecentChats();
      
      return chatEntry.id;
    } catch (error) {
      console.error('Error saving chat:', error);
      return null;
    }
  };

  const openChat = (chat) => {
    // Don't do anything if we're already in this chat
    if (currentChatId === chat.id) {
      navigate('/app/dashboard');
      return;
    }
    
    // Save current chat first if it has messages and it's different
    if (messages.length > 0 && currentChatId !== chat.id) {
      saveCurrentChat();
    }
    
    // Load the selected chat
    setMessages(chat.messages);
    setCurrentChatId(chat.id);
    navigate('/app/dashboard');
    toast.success('Chat caricata!');
  };

  return (
    <>
      {/* Sidebar Desktop */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 256 }}
        className="hidden md:flex flex-col h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 relative"
      >
        {/* Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-8 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors z-10"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>

        {/* Logo */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <Link to="/app/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="text-xl font-bold text-gradient overflow-hidden whitespace-nowrap"
                >
                  AI Studio
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <button
            onClick={handleNewChat}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  Nuova Chat
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>



        {/* Menu Items */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return item.onClick ? (
              <button
                key={item.path}
                onClick={item.onClick}
                className={
                  active
                    ? 'sidebar-item-active w-full'
                    : 'sidebar-item w-full'
                }
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${active ? item.color : ''}`} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="overflow-hidden whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            ) : (
              <Link
                key={item.path}
                to={item.path}
                className={
                  active
                    ? 'sidebar-item-active'
                    : 'sidebar-item'
                }
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${active ? item.color : ''}`} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="overflow-hidden whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs text-gray-500 dark:text-gray-400 text-center"
              >
                © 2024 AI Studio
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>

      {/* Mobile Menu Button - Hidden on desktop */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg flex items-center justify-center z-50 transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>
    </>
  );
};

export default Sidebar;
