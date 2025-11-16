import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  Download,
  Wand2,
  Loader2,
  Video as VideoIcon,
  Scissors,
  Music,
  Type
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const VideoEditor = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedVideo, setGeneratedVideo] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(3);
  const [generationStatus, setGenerationStatus] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Inserisci una descrizione');
      return;
    }

    setIsGenerating(true);
    setGenerationStatus('Inizializzazione generazione video...');

    try {
      setGenerationStatus('Invio richiesta al server AI...');
      const response = await axios.post('/api/video/generate', {
        prompt: prompt.trim(),
        duration: duration,
        fps: 24
      });

      if (response.data.status === 'demo') {
        toast.info(response.data.message);
        setGenerationStatus('Modalità demo - Configura REPLICATE_API_KEY per video reali');
      } else {
        setGenerationStatus('Video generato con successo!');
        toast.success('Video generato!');
        
        // Save to history
        const historyItem = {
          id: Date.now(),
          prompt: prompt,
          videoUrl: response.data.videoUrl,
          timestamp: new Date().toISOString(),
          duration: duration
        };
        
        const videoHistory = JSON.parse(localStorage.getItem('videoHistory') || '[]');
        videoHistory.unshift(historyItem);
        localStorage.setItem('videoHistory', JSON.stringify(videoHistory.slice(0, 50)));
      }

      setGeneratedVideo(response.data.videoUrl);
    } catch (error) {
      console.error('Error generating video:', error);
      setGenerationStatus('Errore - usando video demo');
      toast.error('Errore nella generazione');
      
      // Demo fallback
      setGeneratedVideo('https://www.w3schools.com/html/mov_bbb.mp4');
      toast.info('Modalità demo attiva - video di esempio');
    } finally {
      setIsGenerating(false);
      setTimeout(() => setGenerationStatus(''), 3000);
    }
  };

  const handleSave = () => {
    if (!generatedVideo) {
      toast.error('Nessun video da salvare');
      return;
    }

    try {
      const savedVideos = JSON.parse(localStorage.getItem('savedVideos') || '[]');
      
      const newVideo = {
        id: Date.now(),
        url: generatedVideo,
        prompt: prompt || 'Video generato',
        duration: duration,
        timestamp: Date.now()
      };

      savedVideos.unshift(newVideo);
      localStorage.setItem('savedVideos', JSON.stringify(savedVideos));
      
      console.log('Video salvato:', newVideo);
      console.log('Totale video salvati:', savedVideos.length);
      
      toast.success('Video salvato! Vai su "Salvati" per vederlo');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Errore durante il salvataggio');
    }
  };

  const handleDownload = () => {
    if (!generatedVideo) return;
    
    const link = document.createElement('a');
    link.href = generatedVideo;
    link.download = `ai-studio-video-${Date.now()}.mp4`;
    link.click();
    toast.success('Download avviato!');
  };

  const examplePrompts = [
    'A majestic eagle soaring through cloudy skies',
    'Ocean waves crashing dramatically on rocks',
    'Time-lapse of flowers blooming in spring',
    'Northern lights dancing over snowy mountains',
    'Cinematic drone shot flying through a forest',
    'Futuristic city with flying cars at night'
  ];

  return (
    <div className="h-full flex flex-col lg:flex-row gap-4 p-6">
      {/* Left Panel - Controls */}
      <div className="w-full lg:w-80 space-y-4">
        <div className="card">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <VideoIcon className="w-5 h-5 text-red-500" />
            Genera Video AI
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Descrivi il video
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Es: Timelapse di un tramonto sul mare..."
                className="input-field resize-none"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Durata
              </label>
              <select 
                className="input-field"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                disabled={isGenerating}
              >
                <option value="5">5 secondi (HD)</option>
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                🎥 DEMO MODE - Video placeholder (configura API per video reali)
              </p>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generazione...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Genera Video
                </>
              )}
            </button>
            
            {generationStatus && (
              <div className="text-sm text-center text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
                {generationStatus}
              </div>
            )}

            {/* Example Prompts */}
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Esempi rapidi:
              </p>
              <div className="flex flex-wrap gap-2">
                {examplePrompts.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setPrompt(example)}
                    className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tools */}
        {generatedVideo && (
          <div className="card">
            <h3 className="text-lg font-semibold mb-3">Strumenti</h3>
            
            <div className="space-y-2">
              <button className="w-full btn-ghost flex items-center gap-2">
                <Scissors className="w-4 h-4" />
                Taglia
              </button>
              <button className="w-full btn-ghost flex items-center gap-2">
                <Music className="w-4 h-4" />
                Aggiungi Musica
              </button>
              <button className="w-full btn-ghost flex items-center gap-2">
                <Type className="w-4 h-4" />
                Sottotitoli
              </button>
              <button
                onClick={handleSave}
                className="w-full btn-secondary flex items-center justify-center gap-2"
              >
                <Bookmark className="w-4 h-4" />
                Salva
              </button>
              <button
                onClick={handleSave}
                className="w-full btn-secondary flex items-center justify-center gap-2"
              >
                <Bookmark className="w-4 h-4" />
                Salva
              </button>
              <button
                onClick={handleDownload}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Scarica Video
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Panel - Video Preview */}
      <div className="flex-1 card flex items-center justify-center min-h-[400px]">
        {generatedVideo ? (
          <div className="w-full max-w-3xl">
            <video
              src={generatedVideo}
              controls
              className="w-full rounded-lg shadow-lg"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
            <div className="mt-4 flex items-center gap-4">
              <button
                onClick={() => {
                  const video = document.querySelector('video');
                  if (isPlaying) {
                    video.pause();
                  } else {
                    video.play();
                  }
                }}
                className="btn-primary flex items-center gap-2"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? 'Pausa' : 'Riproduci'}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400">
            <VideoIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">Nessun video</p>
            <p className="text-sm">Genera un video per iniziare</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoEditor;
