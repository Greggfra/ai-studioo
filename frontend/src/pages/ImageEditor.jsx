import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Wand2,
  Download,
  Undo,
  Redo,
  Trash2,
  Loader2,
  Sparkles,
  Image as ImageIcon,
  Brush,
  Eraser,
  Move,
  Palette,
  Bookmark
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

const ImageEditor = () => {
  const location = useLocation();
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [selectedTool, setSelectedTool] = useState('select');
  const [brushSize, setBrushSize] = useState(10);
  const [editingId, setEditingId] = useState(null);
  
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Load image from saved items
  useEffect(() => {
    if (location.state?.imageUrl) {
      console.log('Loading image from state:', location.state);
      const savedImages = JSON.parse(localStorage.getItem('savedImages') || '[]');
      const savedImage = savedImages.find(img => img.id === location.state.id);
      
      if (savedImage?.originalUrl) {
        // Use original image if available
        setOriginalImage(savedImage.originalUrl);
        setGeneratedImage(savedImage.originalUrl);
      } else {
        // Fallback to the displayed image
        setOriginalImage(location.state.imageUrl);
        setGeneratedImage(location.state.imageUrl);
      }
      
      setIsImageLoading(true);
      if (location.state?.id) {
        console.log('Setting editing ID:', location.state.id);
        setEditingId(location.state.id);
      }
      if (location.state?.prompt) {
        setPrompt(location.state.prompt);
      }
      toast.success('Immagine caricata - puoi modificarla');
    }
  }, [location.state]);

  const tools = [
    { id: 'select', icon: Move, label: 'Seleziona' },
    { id: 'brush', icon: Brush, label: 'Pennello' },
    { id: 'eraser', icon: Eraser, label: 'Gomma' },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Inserisci una descrizione');
      return;
    }

    setIsGenerating(true);
    setIsImageLoading(true);

    try {
      const response = await axios.post('/api/image/generate', {
        prompt: prompt.trim()
      });

      console.log('Image URL received:', response.data.imageUrl);
      setOriginalImage(response.data.imageUrl);
      setGeneratedImage(response.data.imageUrl);
      toast.success('Immagine generata! Attendere il caricamento...');
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Errore nella generazione');
      setIsImageLoading(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (!generatedImage) {
      toast.error('Nessuna immagine da salvare');
      return;
    }

    // Combine image with canvas drawings for display
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = originalImage || generatedImage;
    
    img.onload = () => {
      tempCanvas.width = img.width;
      tempCanvas.height = img.height;
      
      // Draw original image
      tempCtx.drawImage(img, 0, 0);
      
      // Draw canvas edits if any
      const drawingCanvas = canvasRef.current;
      if (drawingCanvas) {
        tempCtx.drawImage(drawingCanvas, 0, 0);
      }
      
      // Convert to data URL for display
      const finalImageUrl = tempCanvas.toDataURL('image/png');
      
      // Save canvas data separately
      const canvasData = drawingCanvas ? drawingCanvas.toDataURL('image/png') : null;
      
      try {
        const savedImages = JSON.parse(localStorage.getItem('savedImages') || '[]');
        
        console.log('Editing ID:', editingId);
        console.log('Current images:', savedImages);
        
        if (editingId) {
          // Update existing image
          const index = savedImages.findIndex(img => img.id === editingId);
          console.log('Found index:', index);
          
          if (index !== -1) {
            savedImages[index] = {
              ...savedImages[index],
              url: finalImageUrl,
              originalUrl: originalImage || generatedImage,
              canvasData: canvasData,
              prompt: prompt || 'Immagine generata',
              timestamp: Date.now()
            };
            localStorage.setItem('savedImages', JSON.stringify(savedImages));
            console.log('Immagine aggiornata con disegni');
            toast.success('Immagine salvata!');
          } else {
            console.error('Immagine non trovata con ID:', editingId);
            toast.error('Immagine non trovata');
          }
        } else {
          // Create new image
          const newImage = {
            id: Date.now(),
            url: finalImageUrl,
            originalUrl: originalImage || generatedImage,
            canvasData: canvasData,
            prompt: prompt || 'Immagine generata',
            timestamp: Date.now(),
            size: '1024x1024'
          };
          savedImages.unshift(newImage);
          localStorage.setItem('savedImages', JSON.stringify(savedImages));
          setEditingId(newImage.id);
          console.log('Nuova immagine salvata:', newImage);
          toast.success('Immagine salvata! Vai su "Salvati" per vederla');
        }
        
        console.log('Totale immagini salvate:', savedImages.length);
        // NON pulire il canvas - i disegni devono rimanere visibili
      } catch (error) {
        console.error('Save error:', error);
        toast.error('Errore durante il salvataggio');
      }
    };
    
    img.onerror = () => {
      toast.error('Errore nel caricamento dell\'immagine');
    };
  };

  const handleDownload = async () => {
    if (!generatedImage) return;

    try {
      toast.loading('Preparazione download...');
      
      // Create a temporary canvas to combine all layers
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = generatedImage;
      
      img.onload = () => {
        tempCanvas.width = img.width;
        tempCanvas.height = img.height;
        
        // Draw original image
        tempCtx.drawImage(img, 0, 0);
        
        // Draw canvas edits if any
        const drawingCanvas = canvasRef.current;
        if (drawingCanvas) {
          tempCtx.drawImage(drawingCanvas, 0, 0);
        }
        
        // Convert to blob and download
        tempCanvas.toBlob((blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `ai-studio-edited-${prompt.substring(0, 30).replace(/[^a-z0-9]/gi, '-')}-${Date.now()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          window.URL.revokeObjectURL(url);
          
          toast.dismiss();
          toast.success('Immagine scaricata!');
          saveToHistory();
        }, 'image/png');
      };
      
    } catch (error) {
      console.error('Download error:', error);
      toast.dismiss();
      toast.error('Errore durante il download');
    }
  };

  const saveToHistory = () => {
    try {
      const history = JSON.parse(localStorage.getItem('imageHistory') || '[]');
      const newEntry = {
        id: Date.now(),
        prompt: prompt,
        imageUrl: generatedImage,
        timestamp: new Date().toISOString(),
        type: 'image'
      };
      
      // Keep only last 20 images
      const updatedHistory = [newEntry, ...history].slice(0, 20);
      localStorage.setItem('imageHistory', JSON.stringify(updatedHistory));
      
      console.log('Image saved to history');
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  };

  const handleClear = () => {
    setGeneratedImage(null);
    setPrompt('');
    toast.success('Canvas pulito');
  };

  // Setup canvas size based on image
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !generatedImage) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = originalImage || generatedImage;
    
    img.onload = () => {
      // Resize canvas
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Restore canvas drawings from localStorage if editing existing image
      if (editingId) {
        const savedImages = JSON.parse(localStorage.getItem('savedImages') || '[]');
        const savedImage = savedImages.find(img => img.id === editingId);
        
        if (savedImage?.canvasData) {
          const ctx = canvas.getContext('2d');
          const restoreImg = new Image();
          restoreImg.src = savedImage.canvasData;
          restoreImg.onload = () => {
            ctx.drawImage(restoreImg, 0, 0);
            console.log('Canvas drawings restored');
          };
        }
      }
      
      setIsImageLoading(false);
    };

    img.onerror = (error) => {
      console.error('Image load error:', error);
      toast.error('Errore nel caricamento immagine');
      setIsImageLoading(false);
    };
  }, [generatedImage, originalImage, editingId]);

  // Drawing functions for brush and eraser
  const startDrawing = (e) => {
    if (selectedTool !== 'brush' && selectedTool !== 'eraser') return;
    
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing || (selectedTool !== 'brush' && selectedTool !== 'eraser')) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    if (selectedTool === 'brush') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = '#000000';
    } else if (selectedTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0,0,0,1)';
    }
    
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = 'source-over';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
              <ImageIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
              AI Studio - Editor Immagini
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Genera e modifica immagini con l'intelligenza artificiale
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 space-y-6"
          >
            {/* Generation Panel */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-purple-600" />
                Genera Immagine
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Descrizione
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Descrivi l'immagine che vuoi generare..."
                    rows={4}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  />
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Sparkles className="w-5 h-5" />
                  )}
                  {isGenerating ? 'Generazione...' : 'Genera Immagine'}
                </motion.button>
              </div>
            </div>

            {/* Tools Panel */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5 text-blue-600" />
                Strumenti
              </h3>
              
              <div className="space-y-3">
                {tools.map((tool) => (
                  <motion.button
                    key={tool.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedTool(tool.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                      selectedTool === tool.id 
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-2 border-blue-300 dark:border-blue-600' 
                        : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <tool.icon className="w-5 h-5" />
                    <span className="font-medium">{tool.label}</span>
                  </motion.button>
                ))}
              </div>

              {/* Brush Size */}
              {(selectedTool === 'brush' || selectedTool === 'eraser') && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Dimensione: {brushSize}px
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}


            </div>

            {/* Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Azioni</h3>
              
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={!generatedImage}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Bookmark className="w-4 h-4" />
                  Salva
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDownload}
                  disabled={!generatedImage}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Scarica
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClear}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Pulisci
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Main Canvas Area */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-9"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 h-full">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-purple-600" />
                Canvas
              </h3>
              
              <div className="relative min-h-96 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center overflow-hidden">
                {isImageLoading && (
                  <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-50 flex items-center justify-center z-10">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">Caricamento immagine...</p>
                    </div>
                  </div>
                )}
                
                {generatedImage ? (
                  <div className="relative inline-block">
                    {/* Background image - never modified */}
                    <img
                      src={originalImage || generatedImage}
                      alt="Generated"
                      className="max-w-full h-auto rounded-lg"
                      crossOrigin="anonymous"
                    />
                    {/* Transparent canvas overlay for drawing only */}
                    <canvas
                      ref={canvasRef}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      className={`absolute top-0 left-0 max-w-full h-auto rounded-lg ${(selectedTool === 'brush' || selectedTool === 'eraser') ? 'cursor-crosshair' : 'cursor-default'}`}
                      style={{ pointerEvents: 'auto' }}
                    />
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ImageIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                      Genera un'immagine per iniziare a modificarla
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;