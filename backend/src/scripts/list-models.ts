import 'dotenv/config';
import fetch from 'node-fetch';

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('Missing GEMINI_API_KEY');
    return;
  }

  const urls = [
    `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`,
    `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
  ];

  for (const url of urls) {
    console.log(`\nFetching models from: ${url.split('?')[0]}...`);
    try {
      const response = await fetch(url);
      const data: any = await response.json();
      
      if (data.error) {
        console.error(`Error (${url.split('/')[3]}):`, data.error.message);
        continue;
      }

      if (data.models) {
        console.log(`Found ${data.models.length} models:`);
        data.models.forEach((m: any) => {
          console.log(`- ${m.name} (${m.supportedGenerationMethods.join(', ')})`);
        });
      } else {
        console.log('No models found in response.');
      }
    } catch (err: any) {
      console.error(`Failed to fetch from ${url}:`, err.message);
    }
  }
}

listModels();
