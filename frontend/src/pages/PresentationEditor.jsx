import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  Download,
  Wand2,
  Loader2,
  Presentation as PresentationIcon,
  ChevronLeft,
  ChevronRight,
  Maximize,
  FileText,
  Bookmark,
  X
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import { useLocation } from 'react-router-dom';
import pptxgen from 'pptxgenjs';

const PresentationEditor = () => {
  const location = useLocation();
  const [prompt, setPrompt] = useState('');
  const [presentationTitle, setPresentationTitle] = useState('');
  const [slides, setSlides] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [numberOfSlides, setNumberOfSlides] = useState(5);
  const [template, setTemplate] = useState('modern');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFormatModal, setShowFormatModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Load presentation from saved items
  useEffect(() => {
    if (location.state?.slides && location.state?.title) {
      console.log('Loading presentation from state:', location.state);
      setSlides(location.state.slides);
      setPresentationTitle(location.state.title);
      if (location.state?.template) {
        setTemplate(location.state.template);
      }
      if (location.state?.id) {
        console.log('Setting editing ID:', location.state.id);
        setEditingId(location.state.id);
      } else {
        console.log('No ID in location.state');
      }
      toast.success('Presentazione caricata');
    }
  }, [location.state]);

  // Sync presentationTitle with first slide's title whenever slides change
  useEffect(() => {
    if (slides.length > 0 && slides[0].type === 'title' && slides[0].title) {
      setPresentationTitle(slides[0].title);
    }
  }, [slides]);

  // Keyboard navigation in fullscreen
  useEffect(() => {
    if (!isFullscreen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      } else if (e.key === 'ArrowLeft' && currentSlideIndex > 0) {
        setCurrentSlideIndex(prev => prev - 1);
      } else if (e.key === 'ArrowRight' && currentSlideIndex < slides.length - 1) {
        setCurrentSlideIndex(prev => prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, currentSlideIndex, slides.length]);

  const templates = [
    { id: 'modern', name: 'Modern', bg: 'bg-gradient-to-br from-blue-500 to-purple-600' },
    { id: 'minimal', name: 'Minimal', bg: 'bg-white border-2 border-gray-300' },
    { id: 'dark', name: 'Dark', bg: 'bg-gradient-to-br from-gray-800 to-gray-900' },
    { id: 'gradient', name: 'Gradient', bg: 'bg-gradient-to-br from-pink-500 to-orange-500' },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Inserisci un argomento');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await axios.post('/api/presentation/generate', {
        prompt: prompt.trim(),
        template: template,
        numberOfSlides: numberOfSlides
      });

      setPresentationTitle(response.data.title || prompt);
      setSlides(response.data.slides || []);
      setCurrentSlideIndex(0);
      
      toast.success(`✅ ${response.data.slides.length} slide generate con ${response.data.generatedBy}!`);
      
      // Save to localStorage
      const history = JSON.parse(localStorage.getItem('presentationHistory') || '[]');
      history.unshift({
        id: Date.now(),
        title: response.data.title || prompt,
        slides: response.data.slides,
        template: template,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('presentationHistory', JSON.stringify(history.slice(0, 20)));
      
    } catch (error) {
      console.error('Error generating presentation:', error);
      toast.error('Errore nella generazione');
      
      // Demo fallback
      const demoSlides = [
        {
          type: 'title',
          title: prompt,
          subtitle: 'Professional Presentation'
        },
        {
          type: 'content',
          title: 'Introduction',
          content: 'Key overview and concepts',
          bullets: ['Main point 1', 'Main point 2', 'Main point 3']
        },
        {
          type: 'content',
          title: 'Development',
          content: 'Detailed exploration',
          bullets: ['Important detail', 'Practical example', 'Use case']
        },
        {
          type: 'content',
          title: 'Conclusion',
          content: 'Summary and takeaways',
          bullets: ['Recap', 'Next steps', 'Call to action']
        }
      ];
      setPresentationTitle(prompt);
      setSlides(demoSlides);
      setCurrentSlideIndex(0);
    } finally {
      setIsGenerating(false);
    }
  };

  const addSlide = () => {
    const newSlide = {
      type: 'content',
      title: 'New Slide',
      content: 'Slide content',
      bullets: ['Point 1', 'Point 2', 'Point 3']
    };
    setSlides([...slides, newSlide]);
    setCurrentSlideIndex(slides.length);
    toast.success('Slide added');
  };

  const deleteSlide = (index) => {
    if (slides.length === 1) {
      toast.error('Non puoi eliminare l\'unica slide');
      return;
    }
    const newSlides = slides.filter((_, i) => i !== index);
    setSlides(newSlides);
    if (currentSlideIndex >= newSlides.length) {
      setCurrentSlideIndex(newSlides.length - 1);
    }
    toast.success('Slide eliminata');
  };

  const updateSlide = (index, field, value) => {
    const newSlides = [...slides];
    newSlides[index][field] = value;
    setSlides(newSlides);
    
    // Sync the presentation title with the first slide's title
    if (index === 0 && field === 'title' && newSlides[0].type === 'title') {
      setPresentationTitle(value);
    }
  };

  const handleSave = () => {
    if (slides.length === 0) {
      toast.error('Nessuna slide da salvare');
      return;
    }

    try {
      const savedPresentations = JSON.parse(localStorage.getItem('savedPresentations') || '[]');
      
      console.log('Editing ID:', editingId);
      console.log('Current presentations:', savedPresentations);
      
      if (editingId) {
        // Update existing presentation
        const index = savedPresentations.findIndex(p => p.id === editingId);
        console.log('Found index:', index);
        
        if (index !== -1) {
          savedPresentations[index] = {
            ...savedPresentations[index],
            title: presentationTitle || 'Presentazione',
            slides: slides,
            template: template,
            timestamp: Date.now(),
            slideCount: slides.length
          };
          localStorage.setItem('savedPresentations', JSON.stringify(savedPresentations));
          console.log('Presentazione aggiornata:', savedPresentations[index]);
          toast.success('Presentazione aggiornata!');
        } else {
          console.error('Presentazione non trovata con ID:', editingId);
          toast.error('Presentazione non trovata');
        }
      } else {
        // Create new presentation
        const newPresentation = {
          id: Date.now(),
          title: presentationTitle || prompt.substring(0, 50) || 'Presentazione',
          slides: slides,
          template: template,
          timestamp: Date.now(),
          slideCount: slides.length
        };
        savedPresentations.unshift(newPresentation);
        localStorage.setItem('savedPresentations', JSON.stringify(savedPresentations));
        setEditingId(newPresentation.id);
        console.log('Nuova presentazione salvata:', newPresentation);
        toast.success('Presentazione salvata! Vai su "Salvati" per vederla');
      }
      
      console.log('Totale presentazioni salvate:', savedPresentations.length);
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Errore durante il salvataggio');
    }
  };

  const handleDownloadClick = () => {
    if (slides.length === 0) {
      toast.error('Nessuna slide da scaricare');
      return;
    }
    setShowFormatModal(true);
  };

  const handleDownloadPDF = () => {
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

      const colors = templateColors[template] || templateColors.modern;

      slides.forEach((slide, index) => {
        if (index > 0) pdf.addPage();
        
        // Background color
        pdf.setFillColor(...colors.bg);
        pdf.rect(0, 0, 297, 210, 'F');
        
        // Text color
        pdf.setTextColor(...colors.text);
        
        // Title slide
        if (slide.type === 'title') {
          pdf.setFontSize(32);
          pdf.text(slide.title || '', 148.5, 80, { align: 'center' });
          pdf.setFontSize(18);
          pdf.text(slide.subtitle || '', 148.5, 100, { align: 'center' });
        } else {
          // Content slide
          pdf.setFontSize(24);
          pdf.text(slide.title || '', 20, 30);
          
          if (slide.content) {
            pdf.setFontSize(14);
            pdf.text(slide.content, 20, 50);
          }
          
          if (slide.bullets && slide.bullets.length > 0) {
            pdf.setFontSize(12);
            slide.bullets.forEach((bullet, i) => {
              const lines = pdf.splitTextToSize(`• ${bullet}`, 250);
              pdf.text(lines, 30, 70 + (i * 10));
            });
          }
        }
      });

      const filename = presentationTitle ? 
        `${presentationTitle.toLowerCase().replace(/\s+/g, '-')}.pdf` : 
        `presentation-${Date.now()}.pdf`;
      
      pdf.save(filename);
      toast.success('PDF scaricato!');
      setShowFormatModal(false);
    } catch (error) {
      console.error('PDF error:', error);
      toast.error(`Errore PDF: ${error.message}`);
    }
  };

  const handleDownloadPPTX = async () => {
    try {
      const pptx = new pptxgen();
      
      // Template styles
      const templateStyles = {
        modern: { bg: '4472C4', text: 'FFFFFF' },
        minimal: { bg: 'FFFFFF', text: '000000' },
        dark: { bg: '1F2937', text: 'FFFFFF' },
        gradient: { bg: 'EC4899', text: 'FFFFFF' }
      };

      const style = templateStyles[template] || templateStyles.modern;
      
      slides.forEach((slide, index) => {
        const pptxSlide = pptx.addSlide();
        
        // Background
        pptxSlide.background = { color: style.bg };
        
        if (slide.type === 'title') {
          // Title slide
          pptxSlide.addText(slide.title || '', {
            x: 0.5,
            y: 2.5,
            w: 9,
            h: 1,
            fontSize: 44,
            bold: true,
            color: style.text,
            align: 'center'
          });
          
          if (slide.subtitle) {
            pptxSlide.addText(slide.subtitle, {
              x: 0.5,
              y: 3.8,
              w: 9,
              h: 0.5,
              fontSize: 24,
              color: style.text,
              align: 'center'
            });
          }
        } else {
          // Content slide
          pptxSlide.addText(slide.title || '', {
            x: 0.5,
            y: 0.5,
            w: 9,
            h: 1,
            fontSize: 32,
            bold: true,
            color: style.text,
            align: 'center'
          });
          
          if (slide.bullets && slide.bullets.length > 0) {
            const bulletText = slide.bullets.map(bullet => ({ 
              text: bullet, 
              options: { bullet: true } 
            }));
            
            pptxSlide.addText(bulletText, {
              x: 0.5,
              y: 2,
              w: 9,
              h: 4,
              fontSize: 18,
              color: style.text,
              valign: 'top'
            });
          }
        }
        
        // Footer
        pptxSlide.addText(`Slide ${index + 1} di ${slides.length}`, {
          x: 0.5,
          y: 6.8,
          w: 9,
          h: 0.3,
          fontSize: 10,
          color: 'CCCCCC',
          align: 'center'
        });
      });
      
      const filename = presentationTitle ? 
        `${presentationTitle.toLowerCase().replace(/\s+/g, '-')}.pptx` : 
        `presentation-${Date.now()}.pptx`;
      
      await pptx.writeFile({ fileName: filename });
      toast.success('PPTX scaricato!');
      setShowFormatModal(false);
    } catch (error) {
      console.error('PPTX error:', error);
      toast.error(`Errore PPTX: ${error.message}`);
    }
  };

  const currentSlide = slides[currentSlideIndex];

  const exampleTopics = [
    'Introduction to AI',
    'Digital Marketing Strategy',
    'Sustainable Business',
    'Future of Remote Work',
    'Blockchain Technology',
    'Data Science Basics'
  ];

  return (
    <div className="h-full overflow-hidden">
      <div className="h-full flex gap-6 p-6">
        {/* Left Sidebar - Generation */}
        <div className="w-96 flex flex-col gap-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <PresentationIcon className="w-5 h-5 text-green-500" />
              Genera Presentazione
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Descrizione
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Descrivi la presentazione che vuoi generare..."
                  className="input-field resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Numero di Slide
                </label>
                <select
                  value={numberOfSlides}
                  onChange={(e) => setNumberOfSlides(Number(e.target.value))}
                  className="input-field"
                >
                  <option value={3}>3 slide</option>
                  <option value={5}>5 slide</option>
                  <option value={7}>7 slide</option>
                  <option value={10}>10 slide</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Template
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {templates.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTemplate(t.id)}
                      className={`p-4 rounded-lg ${t.bg} ${
                        template === t.id
                          ? 'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-gray-800'
                          : ''
                      }`}
                    >
                      <span className={`text-xs font-medium ${
                        t.id === 'minimal' ? 'text-gray-900' : 'text-white'
                      }`}>
                        {t.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generazione...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    Genera Presentazione
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* Slide List */}
          {slides.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Slides</h3>
                <button
                  onClick={addSlide}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {slides.map((slide, index) => (
                  <div
                    key={index}
                    onClick={() => setCurrentSlideIndex(index)}
                    className={`p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                      currentSlideIndex === index
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium truncate">{slide.title}</p>
                        <p className="text-xs text-gray-500 mt-1">Slide {index + 1}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSlide(index);
                        }}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Center - Slide Preview */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col min-w-0">
        {currentSlide ? (
          <div className="flex flex-col">
            {/* Slide Preview */}
            <div className={`w-full aspect-video ${templates.find(t => t.id === template)?.bg} rounded-lg p-8 flex flex-col justify-center overflow-hidden`}>
              {currentSlide.type === 'title' ? (
                <>
                  <input
                    type="text"
                    value={currentSlide.title}
                    onChange={(e) => updateSlide(currentSlideIndex, 'title', e.target.value)}
                    className={`text-3xl md:text-4xl font-bold mb-3 bg-transparent border-none focus:outline-none text-center ${
                      template === 'minimal' ? 'text-gray-900' : 'text-white'
                    }`}
                    placeholder="Presentation Title"
                  />
                  <input
                    type="text"
                    value={currentSlide.subtitle || ''}
                    onChange={(e) => updateSlide(currentSlideIndex, 'subtitle', e.target.value)}
                    className={`text-lg md:text-xl bg-transparent border-none focus:outline-none text-center ${
                      template === 'minimal' ? 'text-gray-600' : 'text-white/80'
                    }`}
                    placeholder="Subtitle"
                  />
                </>
              ) : (
                /* Content Slide */
                <div className="overflow-y-auto max-h-full">
                  <input
                    type="text"
                    value={currentSlide.title}
                    onChange={(e) => updateSlide(currentSlideIndex, 'title', e.target.value)}
                    className={`text-2xl md:text-3xl font-bold mb-4 bg-transparent border-none focus:outline-none ${
                      template === 'minimal' ? 'text-gray-900' : 'text-white'
                    }`}
                    placeholder="Slide Title"
                  />
                  <textarea
                    value={currentSlide.content || ''}
                    onChange={(e) => updateSlide(currentSlideIndex, 'content', e.target.value)}
                    className={`text-base md:text-lg mb-3 bg-transparent border-none focus:outline-none resize-none w-full ${
                      template === 'minimal' ? 'text-gray-700' : 'text-white/90'
                    }`}
                    rows={2}
                    placeholder="Slide content"
                  />
                  {currentSlide.bullets && currentSlide.bullets.length > 0 && (
                    <ul className="space-y-2">
                      {currentSlide.bullets.map((bullet, i) => (
                        <li
                          key={i}
                          className={`text-sm md:text-base leading-relaxed ${
                            template === 'minimal' ? 'text-gray-600' : 'text-white/80'
                          }`}
                        >
                          • {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
                disabled={currentSlideIndex === 0}
                className="btn-ghost flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Indietro
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Slide {currentSlideIndex + 1} di {slides.length}
              </span>
              <button
                onClick={() => setCurrentSlideIndex(Math.min(slides.length - 1, currentSlideIndex + 1))}
                disabled={currentSlideIndex === slides.length - 1}
                className="btn-ghost flex items-center gap-2"
              >
                Avanti
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Actions - Horizontal Row */}
            <div className="mt-6 flex flex-wrap gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
              >
                <Bookmark className="w-5 h-5" />
                Salva
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDownloadClick}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Scarica
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsFullscreen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
              >
                <Maximize className="w-5 h-5" />
                Fullscreen
              </motion.button>
            </div>
          </div>
        ) : (
          <div className="w-full aspect-video flex items-center justify-center text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-900 rounded-lg">
            <div className="text-center">
              <PresentationIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Nessuna Presentazione</p>
              <p className="text-sm">Genera una presentazione per iniziare</p>
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && currentSlide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
          >
            {/* Close button */}
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-6 right-6 z-50 text-white/70 hover:text-white transition-colors p-2"
              title="Esci (ESC)"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Navigation arrows */}
            {currentSlideIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlideIndex(prev => prev - 1);
                }}
                className="absolute left-6 top-1/2 -translate-y-1/2 z-50 bg-black/30 hover:bg-black/50 text-white p-4 rounded-full transition-colors"
                title="Slide precedente (←)"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {currentSlideIndex < slides.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlideIndex(prev => prev + 1);
                }}
                className="absolute right-6 top-1/2 -translate-y-1/2 z-50 bg-black/30 hover:bg-black/50 text-white p-4 rounded-full transition-colors"
                title="Slide successiva (→)"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            {/* Slide counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 bg-black/30 text-white px-4 py-2 rounded-full text-sm">
              {currentSlideIndex + 1} / {slides.length}
            </div>

            {/* Slide content */}
            <div className={`w-full h-full max-h-screen aspect-video mx-auto ${templates.find(t => t.id === template)?.bg} p-16 flex flex-col justify-center`}>
              {currentSlide.type === 'title' ? (
                <>
                  <h1 className={`text-7xl font-bold mb-6 text-center ${template === 'minimal' ? 'text-gray-900' : 'text-white'}`}>
                    {currentSlide.title}
                  </h1>
                  <p className={`text-3xl text-center ${template === 'minimal' ? 'text-gray-600' : 'text-white/80'}`}>
                    {currentSlide.subtitle}
                  </p>
                </>
              ) : (
                <>
                  <h1 className={`text-6xl font-bold mb-8 ${template === 'minimal' ? 'text-gray-900' : 'text-white'}`}>
                    {currentSlide.title}
                  </h1>
                  {currentSlide.content && (
                    <p className={`text-3xl mb-6 ${template === 'minimal' ? 'text-gray-700' : 'text-white/90'}`}>
                      {currentSlide.content}
                    </p>
                  )}
                  {currentSlide.bullets && currentSlide.bullets.length > 0 && (
                    <ul className="space-y-4">
                      {currentSlide.bullets.map((bullet, i) => (
                        <li
                          key={i}
                          className={`text-2xl ${template === 'minimal' ? 'text-gray-600' : 'text-white/80'}`}
                        >
                          • {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                  onClick={handleDownloadPDF}
                  className="w-full btn-primary flex items-center justify-center gap-3 py-4"
                >
                  <Download className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-semibold">PDF</div>
                    <div className="text-xs opacity-80">Universale, non modificabile</div>
                  </div>
                </button>

                <button
                  onClick={handleDownloadPPTX}
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

export default PresentationEditor;
