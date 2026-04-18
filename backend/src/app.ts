import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { errorHandler } from './core/middlewares/errorHandler';
import v1Router from './modules';
import { env } from './config/env';
import { prisma } from './lib/prisma';

const app = express();

const allowedOrigins = env.ALLOWED_ORIGINS.split(',');
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ 
      status: 'ok', 
      database: 'connected',
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'error', 
      database: 'disconnected',
      message: env.NODE_ENV === 'development' ? (error as Error).message : 'Database connection failed'
    });
  }
});

// Modular Routes v1
app.use('/api/v1', v1Router);

// Error Handling
app.use(errorHandler);

export default app;
