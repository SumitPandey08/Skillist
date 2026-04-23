import 'dotenv/config';

import { env } from './config/env';
import app from './app';

const port = env.PORT;

console.log('🔧 Starting server...');
console.log('Initializing app...');

app.listen(port, () => {
  console.log(`🚀 Skillist Backend running on http://localhost:${port} in ${env.NODE_ENV} mode`);
});
