import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Auth Store
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      userData: null,
      loading: true,
      
      setUser: (user) => set({ user, loading: false }),
      setUserData: (userData) => set({ userData }),
      setLoading: (loading) => set({ loading }),
      
      logout: () => set({ user: null, userData: null })
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Theme Store
export const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'dark',
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'dark' ? 'light' : 'dark' 
      })),
      setTheme: (theme) => set({ theme })
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Chat Store
export const useChatStore = create((set, get) => ({
  conversations: [],
  currentConversationId: null,
  messages: [],
  isLoading: false,
  
  setConversations: (conversations) => set({ conversations }),
  setCurrentConversation: (conversationId) => set({ 
    currentConversationId: conversationId 
  }),
  setMessages: (messages) => set({ messages }),
  
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  clearMessages: () => set({ messages: [] })
}));

// Image Editor Store
export const useImageEditorStore = create((set) => ({
  currentImage: null,
  history: [],
  historyIndex: -1,
  tool: 'select',
  brushSize: 10,
  
  setCurrentImage: (image) => set({ currentImage: image }),
  setTool: (tool) => set({ tool }),
  setBrushSize: (size) => set({ brushSize: size }),
  
  addToHistory: (state) => set((prev) => ({
    history: [...prev.history.slice(0, prev.historyIndex + 1), state],
    historyIndex: prev.historyIndex + 1
  })),
  
  undo: () => set((state) => {
    if (state.historyIndex > 0) {
      return {
        historyIndex: state.historyIndex - 1,
        currentImage: state.history[state.historyIndex - 1]
      };
    }
    return state;
  }),
  
  redo: () => set((state) => {
    if (state.historyIndex < state.history.length - 1) {
      return {
        historyIndex: state.historyIndex + 1,
        currentImage: state.history[state.historyIndex + 1]
      };
    }
    return state;
  })
}));

// Video Editor Store
export const useVideoEditorStore = create((set) => ({
  currentVideo: null,
  timeline: [],
  currentTime: 0,
  isPlaying: false,
  
  setCurrentVideo: (video) => set({ currentVideo: video }),
  setTimeline: (timeline) => set({ timeline }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  
  addToTimeline: (item) => set((state) => ({
    timeline: [...state.timeline, item]
  }))
}));

// Presentation Editor Store
export const usePresentationStore = create((set) => ({
  slides: [],
  currentSlideIndex: 0,
  template: 'modern',
  
  setSlides: (slides) => set({ slides }),
  setCurrentSlide: (index) => set({ currentSlideIndex: index }),
  setTemplate: (template) => set({ template }),
  
  addSlide: (slide) => set((state) => ({
    slides: [...state.slides, slide]
  })),
  
  updateSlide: (index, slide) => set((state) => ({
    slides: state.slides.map((s, i) => i === index ? slide : s)
  })),
  
  deleteSlide: (index) => set((state) => ({
    slides: state.slides.filter((_, i) => i !== index)
  }))
}));
