import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Loader2, 
  Sparkles,
  Copy,
  Check,
  MessageSquarePlus,
  ChevronDown,
  ChevronUp,
  Clock,
  MessageSquare
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useAuthStore, useChatStore } from '../store';
import { chatService } from '../services/firebase';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

const Chat = () => {
  const { user } = useAuthStore();
  const { messages, setMessages, addMessage, isLoading, setLoading } = useChatStore();
  const location = useLocation();
  
  const [input, setInput] = useState('');
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [savedChats, setSavedChats] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load saved chats
  useEffect(() => {
    loadSavedChats();
    const interval = setInterval(loadSavedChats, 2000);
    return () => clearInterval(interval);
  }, []);

  // Load chat from history when chatId is passed
  useEffect(() => {
    if (location.state?.chatId) {
      const chatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
      const chat = chatHistory.find(c => c.id === location.state.chatId);
      if (chat) {
        setMessages(chat.messages || []);
        setCurrentConversationId(chat.id);
        toast.success('Chat caricata dalla cronologia');
      }
    }
  }, [location.state]);

  const loadSavedChats = () => {
    try {
      const chatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
      setSavedChats(chatHistory.slice(0, 10)); // Show last 10
    } catch (error) {
      console.error('Error loading chats:', error);
    }
  };

  // Initialize conversation
  useEffect(() => {
    const initConversation = async () => {
      if (user && !currentConversationId) {
        try {
          const conversationId = await chatService.createConversation(user.uid);
          setCurrentConversationId(conversationId);
        } catch (error) {
          console.error('Error creating conversation:', error);
        }
      }
    };

    initConversation();
  }, [user, currentConversationId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    addMessage(userMessage);
    setInput('');
    setLoading(true);

    try {
      // Send to backend API
      const response = await api.post('/chat', {
        message: input.trim(),
        conversationId: currentConversationId
      });

      const aiMessage = {
        role: 'assistant',
        content: response.data.message,
        timestamp: new Date()
      };

      addMessage(aiMessage);

      // Auto-save conversation to history after each exchange
      setTimeout(() => {
        saveConversationToHistory();
      }, 100);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Errore nell\'invio del messaggio');
      
      // Add error message
      const errorMessage = {
        role: 'assistant',
        content: 'Mi dispiace, si è verificato un errore. Riprova più tardi.',
        timestamp: new Date(),
        isError: true
      };
      addMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };



  const handleNewChat = () => {
    // Save current conversation if it has messages
    if (messages.length > 0) {
      saveConversationToHistory();
    }
    
    // Clear messages and reset conversation
    setMessages([]);
    setCurrentConversationId(null);
    
    toast.success('Nuova chat avviata!');
  };

  const saveConversationToHistory = () => {
    try {
      const chatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
      
      // Get first user message as title
      const firstUserMessage = messages.find(m => m.role === 'user');
      const title = firstUserMessage?.content.substring(0, 50) || 'Conversazione senza titolo';
      
      // Check if this conversation already exists (find by similar title or current ID)
      const existingIndex = chatHistory.findIndex(chat => 
        chat.title === title || (currentConversationId && chat.id === currentConversationId)
      );
      
      const chatEntry = {
        id: existingIndex >= 0 ? chatHistory[existingIndex].id : Date.now(),
        title: title,
        messages: messages,
        timestamp: new Date().toISOString(),
        messageCount: messages.length,
        type: 'chat'
      };
      
      let updatedHistory;
      if (existingIndex >= 0) {
        // Update existing conversation
        updatedHistory = [...chatHistory];
        updatedHistory[existingIndex] = chatEntry;
        // Move to beginning (most recent)
        updatedHistory = [chatEntry, ...updatedHistory.filter((_, i) => i !== existingIndex)];
      } else {
        // Add new conversation
        updatedHistory = [chatEntry, ...chatHistory];
      }
      
      // Keep only last 50
      updatedHistory = updatedHistory.slice(0, 50);
      localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
      
      // Update currentConversationId if it was a new conversation
      if (existingIndex < 0) {
        setCurrentConversationId(chatEntry.id);
      }
      
      loadSavedChats();
      
      console.log('Conversation saved to history');
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  };

  const openSavedChat = (chat) => {
    // Save current chat if it has messages and is different
    if (messages.length > 0 && JSON.stringify(messages) !== JSON.stringify(chat.messages)) {
      saveConversationToHistory();
    }
    
    // Load chat and set its ID
    setMessages(chat.messages);
    setCurrentConversationId(chat.id);
    setShowChatHistory(false);
    toast.success('Chat caricata!');
  };



  return (
    <div className="h-full flex flex-col">
      {/* Header with Quick Commands */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        {/* Chat History Dropdown */}
        <div className="p-4 pb-2">
          <button
            onClick={() => setShowChatHistory(!showChatHistory)}
            className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-500" />
              <span className="font-medium text-sm">
                Conversazioni Salvate
              </span>
              {savedChats.length > 0 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ({savedChats.length})
                </span>
              )}
            </div>
            {showChatHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {/* Dropdown Content */}
          <AnimatePresence>
            {showChatHistory && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 space-y-2 overflow-hidden"
              >
                {/* Saved Chats */}
                {savedChats.length > 0 ? (
                  <div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2 px-1">
                      <Clock className="w-3 h-3" />
                      <span>CONVERSAZIONI</span>
                    </div>
                    <div className="space-y-1 max-h-60 overflow-y-auto">
                      {savedChats.map((chat) => (
                        <button
                          key={chat.id}
                          onClick={() => openSavedChat(chat)}
                          className="w-full text-left p-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors"
                        >
                          <p className="text-sm font-medium truncate">
                            {chat.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {chat.messageCount} messaggi • {new Date(chat.timestamp).toLocaleDateString()}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                    Nessuna conversazione salvata
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>


      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full flex items-center justify-center"
            >
              <div className="text-center max-w-md">
                <Sparkles className="w-16 h-16 mx-auto mb-4 text-primary-500" />
                <h2 className="text-2xl font-bold mb-2">Benvenuto in AI Studio</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Inizia una conversazione o usa i comandi rapidi per generare contenuti AI
                </p>
                <div className="space-y-2 text-left">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    💡 <strong>Suggerimenti:</strong>
                  </p>
                  <ul className="text-sm text-gray-500 dark:text-gray-500 space-y-1">
                    <li>• Fai domande su qualsiasi argomento</li>
                    <li>• Chiedi spiegazioni o aiuto con progetti</li>
                    <li>• Usa la chat per assistenza generale</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          ) : (
            messages.map((message, index) => (
              <MessageBubble key={index} message={message} />
            ))
          )}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">AI sta pensando...</span>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <div className="flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Scrivi un messaggio... (Shift+Enter per nuova riga)"
              className="input-field resize-none"
              rows={1}
              style={{
                minHeight: '44px',
                maxHeight: '200px',
                height: 'auto'
              }}
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="btn-primary h-11 px-4"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
          AI Studio può commettere errori. Verifica le informazioni importanti.
        </p>
      </div>
    </div>
  );
};

const MessageBubble = ({ message }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Copiato negli appunti');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
          message.role === 'user' 
            ? 'bg-primary-600 text-white' 
            : 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
        }`}>
          {message.role === 'user' ? 'U' : 'AI'}
        </div>

        {/* Message Content */}
        <div className="flex-1">
          <div className={`${
            message.role === 'user' ? 'message-user' : 'message-ai'
          } ${message.isError ? 'border-red-300 dark:border-red-700' : ''}`}>
            {message.role === 'assistant' ? (
              <div className="markdown-body">
                <ReactMarkdown
                  components={{
                    code({node, inline, className, children, ...props}) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    }
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="whitespace-pre-wrap">{message.content}</p>
            )}
          </div>

          {/* Actions */}
          {message.role === 'assistant' && !message.isError && (
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={handleCopy}
                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 flex items-center gap-1"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3" />
                    Copiato
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    Copia
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Chat;
