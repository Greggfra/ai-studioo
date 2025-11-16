import express from 'express';

const router = express.Router();

console.log('📹 Video generation in DEMO mode');
console.log('💡 Per abilitare la generazione reale, scegli una di queste opzioni:');
console.log('   • Replicate (Zeroscope V2 XL): ~$0.03/video - https://replicate.com');
console.log('   • FAL.ai (Kling AI): 100 crediti gratis/mese - https://fal.ai');
console.log('   • Runway Gen-3: ~$0.25/video - https://runwayml.com');

// Generate video (DEMO MODE)
router.post('/generate', async (req, res) => {
  try {
    const { prompt, duration = 5 } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log('🎬 Video generation request:', prompt);
    console.log('⚠️ Using demo video - Configure API key in .env for real generation');

    // Demo video URLs pool (free stock videos)
    const demoVideos = [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      'https://www.w3schools.com/html/mov_bbb.mp4'
    ];

    // Return demo video with info message
    res.json({
      message: '🎥 DEMO MODE - Video placeholder generato',
      info: 'Per generare video reali, aggiungi una API key nel file .env',
      videoUrl: demoVideos[0],
      prompt: prompt,
      duration: duration,
      status: 'demo',
      options: {
        replicate: 'Zeroscope V2 XL - $0.03/video',
        fal: 'Kling AI - 100 crediti gratis/mese',
        runway: 'Gen-3 Alpha - $0.25/video'
      }
    });

  } catch (error) {
    console.error('Video generation error:', error);
    
    res.json({
      message: 'Demo video',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      prompt: prompt,
      status: 'demo'
    });
  }
});

// Get video status
router.get('/status/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;

    // Placeholder - check video generation status
    res.json({
      videoId: videoId,
      status: 'completed',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
    });

  } catch (error) {
    console.error('Video status error:', error);
    res.status(500).json({ 
      error: 'Failed to get video status',
      details: error.message 
    });
  }
});

// Add subtitles
router.post('/subtitles', async (req, res) => {
  try {
    const { videoUrl, language = 'it' } = req.body;

    if (!videoUrl) {
      return res.status(400).json({ error: 'Video URL is required' });
    }

    // Placeholder
    res.json({
      message: 'Subtitle generation feature coming soon',
      videoUrl: videoUrl
    });

  } catch (error) {
    console.error('Subtitle generation error:', error);
    res.status(500).json({ 
      error: 'Failed to add subtitles',
      details: error.message 
    });
  }
});

export default router;
