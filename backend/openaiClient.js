import OpenAI from 'openai';

let client = null;

/**
 * Get or create the AI client instance (lazy initialization)
 * Supports both OpenAI and Groq APIs
 */
export function getOpenAI() {
  if (client) return client;

  const provider = process.env.AI_PROVIDER || 'groq';
  
  if (provider === 'groq') {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey || apiKey === 'YOUR_GROQ_API_KEY_HERE') {
      throw new Error('GROQ_API_KEY is not set in environment variables. Get one free at https://console.groq.com');
    }
    
    console.log('✅ Initializing Groq client (FREE & FAST)');
    client = new OpenAI({
      apiKey: apiKey,
      baseURL: 'https://api.groq.com/openai/v1'
    });
  } else {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not set in environment variables');
    }
    
    console.log('✅ Initializing OpenAI client');
    client = new OpenAI({ apiKey });
  }
  
  return client;
}

export default getOpenAI;
