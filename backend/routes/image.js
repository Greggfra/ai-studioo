import express from 'express';

const router = express.Router();

// Generate image using Pollinations.AI (FREE, NO API KEY NEEDED!)
router.post('/generate', async (req, res) => {
  try {
    const { prompt, size = '1024x1024', quality = 'standard' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log('🎨 Generating image with Pollinations.AI (FREE)...');
    console.log('📝 Prompt:', prompt);

    // Determine dimensions based on size
    const dimensions = size === '1024x1024' ? '1024x1024' : '1024x576'; // 16:9 aspect ratio
    const [width, height] = dimensions.split('x');

    // Pollinations.AI URL (completely free, no key needed!)
    // They support multiple models including Flux
    const encodedPrompt = encodeURIComponent(prompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&model=flux&nologo=true&enhance=true&seed=${Date.now()}`;

    console.log('✅ Image URL generated:', imageUrl);

    res.json({
      imageUrl: imageUrl,
      prompt: prompt,
      model: 'flux (pollinations)',
      revisedPrompt: prompt
    });

  } catch (error) {
    console.error('Image generation error:', error);
    
    res.status(500).json({ 
      error: 'Failed to generate image',
      details: error.message 
    });
  }
});

// Edit image (inpainting/outpainting)
router.post('/edit', async (req, res) => {
  try {
    const { imageUrl, prompt, mask } = req.body;

    if (!imageUrl || !prompt) {
      return res.status(400).json({ error: 'Image URL and prompt are required' });
    }

    // Placeholder - implementa logica di editing
    res.json({
      message: 'Image editing feature coming soon',
      imageUrl: imageUrl
    });

  } catch (error) {
    console.error('Image edit error:', error);
    res.status(500).json({ 
      error: 'Failed to edit image',
      details: error.message 
    });
  }
});

// Apply filters
router.post('/filters', async (req, res) => {
  try {
    const { imageUrl, filter } = req.body;

    if (!imageUrl || !filter) {
      return res.status(400).json({ error: 'Image URL and filter are required' });
    }

    // Placeholder - implementa filtri
    res.json({
      message: 'Image filters feature coming soon',
      imageUrl: imageUrl
    });

  } catch (error) {
    console.error('Image filter error:', error);
    res.status(500).json({ 
      error: 'Failed to apply filter',
      details: error.message 
    });
  }
});

export default router;
