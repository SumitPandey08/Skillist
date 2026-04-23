import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

async function listModels() {
  if (!process.env.GEMINI_API_KEY) {
    console.error('Missing GEMINI_API_KEY');
    return;
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  try {
    // The SDK might not have a direct listModels but we can try via the API or check docs
    // Actually the standard SDK doesn't expose listModels easily without direct fetch
    console.log('Testing gemini-1.5-flash...');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent('Hi');
    console.log('gemini-1.5-flash works!');
  } catch (err: any) {
    console.error('gemini-1.5-flash failed:', err.message);
  }

  try {
    console.log('Testing gemini-1.5-flash-latest...');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
    const result = await model.generateContent('Hi');
    console.log('gemini-1.5-flash-latest works!');
  } catch (err: any) {
    console.error('gemini-1.5-flash-latest failed:', err.message);
  }
}

listModels();
