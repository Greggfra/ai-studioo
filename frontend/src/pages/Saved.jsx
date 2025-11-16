import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image as ImageIcon,
  Video,
  Presentation as PresentationIcon,
  Download,
  Trash2,
  Edit,
  Calendar,
  Search,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import pptxgen from 'pptxgenjs';

const Saved = () => {
  const [activeTab, setActiveTab] = useState('images');
  const [savedImages, setSavedImages] = useState([]);
  const [savedVideos, setSavedVideos] = useState([]);
  const [savedPresentations, setSavedPresentations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFormatModal, setShowFormatModal] = useState(false);
  const [selectedPresentation, setSelectedPresentation] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadSavedItems();
    
    // Reload when component mounts (navigation from other pages)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Page became visible - reloading items');
        loadSavedItems();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Also reload on focus
    const handleFocus = () => {
      console.log('Page focused - reloading items');
      loadSavedItems();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);
  
  // Also reload when activeTab changes
  useEffect(() => {
    loadSavedItems();
  }, [activeTab]);

  const loadSavedItems = () => {
    // Load from localStorage
    const images = JSON.parse(localStorage.getItem('savedImages') || '[]');
    const videos = JSON.parse(localStorage.getItem('savedVideos') || '[]');
    const presentations = JSON.parse(localStorage.getItem('savedPresentations') || '[]');

    console.log('Loaded images:', images);
    console.log('Loaded presentations:', presentations);

    setSavedImages(images);
    setSavedVideos(videos);
    setSavedPresentations(presentations);
  };

  const handleDelete = (id, type) => {
    const confirmed = window.confirm('Sei sicuro di voler eliminare questo elemento?');
    if (!confirmed) return;

    if (type === 'image') {
      const updated = savedImages.filter(item => item.id !== id);
      setSavedImages(updated);
      localStorage.setItem('savedImages', JSON.stringify(updated));
    } else if (type === 'video') {
      const updated = savedVideos.filter(item => item.id !== id);
      setSavedVideos(updated);
      localStorage.setItem('savedVideos', JSON.stringify(updated));
    } else if (type === 'presentation') {
      const updated = savedPresentations.filter(item => item.id !== id);
      setSavedPresentations(updated);
      localStorage.setItem('savedPresentations', JSON.stringify(updated));
    }

    toast.success('Elemento eliminato');
  };

  const handleEdit = (item, type) => {
    if (type === 'image') {
      console.log('Opening image for edit with ID:', item.id);
      // Navigate to image editor with the image
      navigate('/app/image-editor', { state: { imageUrl: item.url, id: item.id, prompt: item.prompt } });
    } else if (type === 'presentation') {
      console.log('Opening presentation for edit with ID:', item.id);
      // Navigate to presentation editor with the slides, template and id
      navigate('/app/presentation-editor', { state: { slides: item.slides, title: item.title, template: item.template, id: item.id } });
    }
  };

  const handleDownload = async (url, filename) => {
    try {
      // Try fetch with CORS mode
      const response = await fetch(url, { mode: 'cors' });
      
      if (!response.ok) throw new Error('Network response was not ok');
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(blobUrl);
      toast.success('Download completato');
    } catch (error) {
      console.error('Download error:', error);
      // Fallback: open in new tab if CORS fails
      try {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Download avviato (nuova scheda)');
      } catch (fallbackError) {
        toast.error('Errore nel download. Prova ad aprire il video e salvarlo manualmente.');
      }
    }
  };

  const handleDownloadPDF = (presentation) => {
    try {
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      // Template colors
      const templateColors = {
        modern: { bg: [68, 114, 196], text: [255, 255, 255] },
        minimal: { bg: [255, 255, 255], text: [0, 0, 0] },
        dark: { bg: [31, 41, 55], text: [255, 255, 255] },
        gradient: { bg: [236, 72, 153], text: [255, 255, 255] }
      };

      const colors = templateColors[presentation.template] || templateColors.modern;
      
      presentation.slides.forEach((slide, index) => {
        if (index > 0) pdf.addPage();
        
        // Background color
        pdf.setFillColor(...colors.bg);
        pdf.rect(0, 0, 297, 210, 'F');
        
        // Text color
        pdf.setTextColor(...colors.text);
        
        // Title
        pdf.setFontSize(24);
        pdf.setFont('helvetica', 'bold');
        pdf.text(slide.title || 'Untitled', 20, 30, { maxWidth: 257 });
        
        // Content
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'normal');
        let y = 50;
        
        // Support both bullets and content arrays
        const points = slide.bullets || slide.content || [];
        const pointsArray = Array.isArray(points) ? points : [points];
        
        pointsArray.forEach(point => {
          if (typeof point === 'string') {
            const lines = pdf.splitTextToSize(`• ${point}`, 165);
            lines.forEach(line => {
              if (y > 270) {
                pdf.addPage();
                y = 20;
              }
              pdf.text(line, 25, y);
              y += 7;
            });
            y += 3;
          }
        });
        
        // Footer
        pdf.setFontSize(8);
        pdf.setTextColor(150);
        pdf.text(`Slide ${index + 1} di ${presentation.slides.length}`, 105, 285, { align: 'center' });
        pdf.setTextColor(0);
      });
      
      pdf.save(`${presentation.title || 'presentazione'}.pdf`);
      toast.success('PDF scaricato');
      setShowFormatModal(false);
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error(`Errore nella generazione del PDF: ${error.message}`);
    }
  };

  const handleDownloadPPTX = async (presentation) => {
    try {
      const pptx = new pptxgen();
      
      // Template styles
      const templateStyles = {
        modern: { bg: '4472C4', text: 'FFFFFF' },
        minimal: { bg: 'FFFFFF', text: '000000' },
        dark: { bg: '1F2937', text: 'FFFFFF' },
        gradient: { bg: 'EC4899', text: 'FFFFFF' }
      };

      const style = templateStyles[presentation.template] || templateStyles.modern;
      
      presentation.slides.forEach((slide, index) => {
        const pptxSlide = pptx.addSlide();
        
        // Background gradient
        pptxSlide.background = { color: style.bg };
        
        // Title
        pptxSlide.addText(slide.title || 'Untitled', {
          x: 0.5,
          y: 0.5,
          w: 9,
          h: 1,
          fontSize: 32,
          bold: true,
          color: style.text,
          align: 'center'
        });
        
        // Content bullets - support both bullets and content arrays
        const points = slide.bullets || slide.content || [];
        const pointsArray = Array.isArray(points) ? points : [points];
        
        if (pointsArray.length > 0) {
          const bulletText = pointsArray
            .filter(point => typeof point === 'string')
            .map(point => ({ text: point, options: { bullet: true } }));
          
          if (bulletText.length > 0) {
            pptxSlide.addText(bulletText, {
              x: 0.5,
              y: 2,
              w: 9,
              h: 4,
              fontSize: 16,
              color: style.text,
              valign: 'top'
            });
          }
        }
        
        // Footer
        pptxSlide.addText(`Slide ${index + 1} di ${presentation.slides.length}`, {
          x: 0.5,
          y: 6.8,
          w: 9,
          h: 0.3,
          fontSize: 10,
          color: 'CCCCCC',
          align: 'center'
        });
      });
      
      await pptx.writeFile({ fileName: `${presentation.title || 'presentazione'}.pptx` });
      toast.success('PPTX scaricato');
      setShowFormatModal(false);
    } catch (error) {
      console.error('PPTX generation error:', error);
      toast.error(`Errore nella generazione del PPTX: ${error.message}`);
    }
  };

  const handlePresentationDownloadClick = (presentation) => {
    setSelectedPresentation(presentation);
    setShowFormatModal(true);
  };

  const tabs = [
    { id: 'images', name: 'Immagini', icon: ImageIcon, count: savedImages.length },
    { id: 'videos', name: 'Video', icon: Video, count: savedVideos.length },
    { id: 'presentations', name: 'Presentazioni', icon: PresentationIcon, count: savedPresentations.length },
  ];

  const filterItems = (items) => {
    if (!searchQuery) return items;
    return items.filter(item =>
      (item.prompt || item.title || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="h-full flex flex-col p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Elementi Salvati</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gestisci i tuoi contenuti salvati
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cerca nei salvati..."
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{tab.name}</span>
              <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'images' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterItems(savedImages).length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Nessuna immagine salvata</p>
              </div>
            ) : (
              filterItems(savedImages).map((image) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="card group relative overflow-hidden"
                >
                  <img
                    src={image.url}
                    alt={image.prompt}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {image.prompt}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {formatDate(image.timestamp)}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(image, 'image')}
                        className="btn-secondary flex-1 text-sm py-2 font-medium"
                      >
                        Modifica
                      </button>
                      <button
                        onClick={() => handleDownload(image.url, `image-${image.id}.png`)}
                        className="btn-secondary text-sm py-2 px-3"
                        title="Scarica"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(image.id, 'image')}
                        className="btn-secondary text-sm py-2 px-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Elimina"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterItems(savedVideos).length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Nessun video salvato</p>
              </div>
            ) : (
              filterItems(savedVideos).map((video) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="card"
                >
                  <video
                    src={video.url}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                    controls
                  />
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {video.prompt}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {formatDate(video.timestamp)}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownload(video.url, `video-${video.id}.mp4`)}
                        className="btn-secondary flex-1 text-sm py-2"
                      >
                        <Download className="w-4 h-4" />
                        Scarica
                      </button>
                      <button
                        onClick={() => handleDelete(video.id, 'video')}
                        className="btn-secondary text-sm py-2 px-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Elimina"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {activeTab === 'presentations' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterItems(savedPresentations).length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                <PresentationIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Nessuna presentazione salvata</p>
              </div>
            ) : (
              filterItems(savedPresentations).map((presentation) => {
                // Template styles
                const templateStyles = {
                  modern: { bg: 'bg-gradient-to-br from-blue-500 to-purple-600', text: 'text-white' },
                  minimal: { bg: 'bg-white border-2 border-gray-300', text: 'text-gray-900' },
                  dark: { bg: 'bg-gradient-to-br from-gray-800 to-gray-900', text: 'text-white' },
                  gradient: { bg: 'bg-gradient-to-br from-pink-500 to-orange-500', text: 'text-white' }
                };
                
                const style = templateStyles[presentation.template] || templateStyles.modern;
                
                return (
                <motion.div
                  key={presentation.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="card"
                >
                  <div className={`${style.bg} rounded-lg p-6 mb-3 ${style.text} min-h-[200px] flex flex-col justify-center`}>
                    <h3 className="text-2xl font-bold mb-2">{presentation.title}</h3>
                    <p className="text-sm opacity-80">{presentation.slides?.length || 0} slide</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {formatDate(presentation.timestamp)}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(presentation, 'presentation')}
                        className="btn-secondary flex-1 text-sm py-2 font-medium"
                      >
                        Apri
                      </button>
                      <button
                        onClick={() => handlePresentationDownloadClick(presentation)}
                        className="btn-secondary text-sm py-2 px-3"
                        title="Scarica"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(presentation.id, 'presentation')}
                        className="btn-secondary text-sm py-2 px-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Elimina"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Format Selection Modal */}
      <AnimatePresence>
        {showFormatModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowFormatModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Scegli formato</h3>
                <button
                  onClick={() => setShowFormatModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                In quale formato vuoi scaricare la presentazione?
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => selectedPresentation && handleDownloadPDF(selectedPresentation)}
                  className="w-full btn-primary flex items-center justify-center gap-3 py-4"
                >
                  <Download className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-semibold">PDF</div>
                    <div className="text-xs opacity-80">Universale, non modificabile</div>
                  </div>
                </button>

                <button
                  onClick={() => selectedPresentation && handleDownloadPPTX(selectedPresentation)}
                  className="w-full btn-secondary flex items-center justify-center gap-3 py-4"
                >
                  <Download className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-semibold">PPTX (PowerPoint)</div>
                    <div className="text-xs opacity-80">Modificabile in PowerPoint</div>
                  </div>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Saved;
