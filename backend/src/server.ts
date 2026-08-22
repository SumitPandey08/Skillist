import 'dotenv/config';

import { env } from './config/env';
import app from './app';
import { startKeepAlive } from './core/keep-alive';

const port = env.PORT;

console.log('🔧 Starting server...');
console.log('Initializing app...');

const server = app.listen(port, () => {
  console.log(`🚀 Skillist Backend running on http://localhost:${port} in ${env.NODE_ENV} mode`);
  
  // Start the keep-alive service for Render
  startKeepAlive();
});

