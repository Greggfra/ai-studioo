import express from 'express';
import { config } from '../config/env.js';
import { getOpenAI } from '../openaiClient.js';

const router = express.Router();

// OpenAI client will be obtained lazily inside handlers

// Chat endpoint
router.post('/', async (req, res) => {
  try {
    const { message, conversationId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check for special commands
    if (message.startsWith('/image')) {
      const imagePrompt = message.replace('/image', '').trim();
      
      if (!imagePrompt) {
        return res.json({
          message: '🎨 Specifica cosa vuoi generare dopo il comando /image\n\nEsempio: `/image un gatto che gioca nel giardino`',
          isCommand: true
        });
      }

      try {
        // Generate image using OpenAI DALL-E
        const openai = getOpenAI();
        const imageResponse = await openai.images.generate({
          model: 'dall-e-3',
          prompt: imagePrompt,
          size: '1024x1024',
          quality: 'standard',
          n: 1,
        });

        const imageUrl = imageResponse.data[0].url;

        return res.json({
          message: `🎨 **Immagine generata per:** "${imagePrompt}"\n\n![Immagine generata](${imageUrl})\n\n*Clicca sull'immagine per visualizzarla a schermo intero*`,
          isCommand: true,
          imageUrl: imageUrl,
          prompt: imagePrompt
        });
      } catch (error) {
        console.error('Image generation error:', error);
        return res.json({
          message: `❌ **Errore nella generazione dell'immagine**\n\nNon sono riuscito a generare l'immagine per: "${imagePrompt}"\n\n*Puoi provare con una descrizione diversa o usare l'Editor Immagini dalla sidebar.*`,
          isCommand: true,
          isError: true
        });
      }
    }

    if (message.startsWith('/video')) {
      return res.json({
        message: '🎬 Per creare video, usa l\'Editor Video dalla sidebar. Descrivi il video che vuoi generare!',
        isCommand: true
      });
    }

    if (message.startsWith('/slides')) {
      return res.json({
        message: '📊 Per creare presentazioni, usa l\'Editor Presentazioni dalla sidebar. Indica l\'argomento!',
        isCommand: true
      });
    }

    // Call AI API (Groq or OpenAI)
    const openai = getOpenAI();
    const provider = process.env.AI_PROVIDER || 'groq';
    const model = provider === 'groq' ? 'llama-3.3-70b-versatile' : 'gpt-3.5-turbo';
    
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: 'system',
          content: 'Sei un assistente AI utile, amichevole e professionale. Rispondi in italiano in modo chiaro e conciso. Puoi aiutare con domande generali, spiegazioni tecniche, scrittura creativa e molto altro.'
        },
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const aiMessage = completion.choices[0].message.content;

    res.json({
      message: aiMessage,
      conversationId: conversationId,
      model: model,
      tokens: completion.usage.total_tokens
    });

  } catch (error) {
    console.error('Chat error:', error);
    
    // Handle specific OpenAI errors
    if (error.status === 401) {
      return res.status(401).json({ 
        error: 'Invalid API key. Please check your OpenAI configuration.' 
      });
    }
    
    if (error.status === 429) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded. Please try again later.' 
      });
    }

    res.status(500).json({ 
      error: 'Failed to process chat message',
      details: error.message 
    });
  }
});

// Get conversation history (placeholder)
router.get('/conversations/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // In produzione, recupera da Firebase
    res.json({
      conversations: [],
      message: 'Conversation history feature coming soon'
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to get conversations' });
  }
});

export default router;
