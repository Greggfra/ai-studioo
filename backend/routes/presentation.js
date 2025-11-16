import express from 'express';
import { config } from '../config/env.js';
import { getOpenAI } from '../openaiClient.js';

const router = express.Router();

// OpenAI client will be obtained lazily inside handlers

// Generate presentation
router.post('/generate', async (req, res) => {
  try {
    const { prompt, template = 'modern', numberOfSlides = 5 } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Use AI to generate presentation content
    console.log('🎨 Generating presentation with Groq (Llama 3.3 70B - FREE)...');
    
    const openai = getOpenAI();
    const provider = process.env.AI_PROVIDER || 'groq';
    const model = provider === 'groq' ? 'llama-3.3-70b-versatile' : 'gpt-3.5-turbo';
    
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: 'system',
          content: `You are an expert presentation designer. Create a professional presentation about: "${prompt}".

Generate EXACTLY ${numberOfSlides} slides in JSON format with this structure:
{
  "title": "Main Presentation Title",
  "slides": [
    {
      "type": "title",
      "title": "Presentation Title",
      "subtitle": "Brief subtitle"
    },
    {
      "type": "content",
      "title": "Slide Title",
      "content": "Brief description",
      "bullets": ["Key point 1", "Key point 2", "Key point 3"]
    }
  ]
}

Rules:
- First slide MUST be type "title" with title and subtitle
- Other slides are type "content" with title, content, and 3-4 bullets
- Keep text concise and professional
- Use clear, impactful language
- Respond ONLY with valid JSON, no other text`
        },
        {
          role: 'user',
          content: `Create a ${numberOfSlides}-slide presentation about: ${prompt}`
        }
      ],
      temperature: 0.7,
      max_tokens: 3000
    });

    let presentation;
    try {
      const content = completion.choices[0].message.content;
      console.log('Raw AI response:', content.substring(0, 200));
      
      // Remove markdown code blocks if present
      const jsonContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(jsonContent);
      
      presentation = {
        title: parsed.title || prompt,
        slides: parsed.slides || []
      };
      
      console.log(`✅ Generated ${presentation.slides.length} slides`);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.log('Failed content:', completion.choices[0].message.content);
      
      // Fallback slides
      presentation = {
        title: prompt,
        slides: [
          {
            type: 'title',
            title: prompt,
            subtitle: 'Professional Presentation'
          },
          {
            type: 'content',
            title: 'Introduction',
            content: 'Key concepts and overview',
            bullets: ['Main point 1', 'Main point 2', 'Main point 3']
          },
          {
            type: 'content',
            title: 'Key Details',
            content: 'Important information',
            bullets: ['Detail 1', 'Detail 2', 'Detail 3', 'Detail 4']
          },
          {
            type: 'content',
            title: 'Conclusion',
            content: 'Summary and next steps',
            bullets: ['Summary point', 'Key takeaway', 'Call to action']
          }
        ]
      };
    }

    res.json({
      title: presentation.title,
      slides: presentation.slides,
      template: template,
      prompt: prompt,
      generatedBy: model
    });

  } catch (error) {
    console.error('Presentation generation error:', error);
    
    if (error.status === 401) {
      return res.status(401).json({ 
        error: 'Invalid API key. Please check your OpenAI configuration.' 
      });
    }

    // Fallback response
    res.json({
      slides: [
        {
          title: req.body.prompt,
          content: 'Slide di esempio',
          bullets: ['Punto 1', 'Punto 2', 'Punto 3']
        }
      ],
      template: req.body.template || 'modern',
      note: 'Demo mode - configure OpenAI API key for AI generation'
    });
  }
});

// Export presentation to PDF
router.post('/export', async (req, res) => {
  try {
    const { slides, format = 'pdf' } = req.body;

    if (!slides || slides.length === 0) {
      return res.status(400).json({ error: 'Slides are required' });
    }

    // Placeholder - implementa logica di export
    res.json({
      message: 'Export functionality handled by frontend',
      format: format
    });

  } catch (error) {
    console.error('Presentation export error:', error);
    res.status(500).json({ 
      error: 'Failed to export presentation',
      details: error.message 
    });
  }
});

export default router;
