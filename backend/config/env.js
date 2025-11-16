import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from backend/.env
const envPath = join(__dirname, '..', '.env');
console.log('🔍 Loading .env from:', envPath);
dotenv.config({ path: envPath });

console.log('✅ OpenAI API Key loaded:', process.env.OPENAI_API_KEY ? 'YES' : 'NO');
console.log('📝 API Key starts with:', process.env.OPENAI_API_KEY?.substring(0, 10));

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  openaiApiKey: process.env.OPENAI_API_KEY,
  falApiKey: process.env.FAL_API_KEY,
  groqApiKey: process.env.GROQ_API_KEY,
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
  firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  firebasePrivateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
};
