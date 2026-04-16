import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { errorHandler } from './core/middlewares/errorHandler';
import v1Router from './modules';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Modular Routes v1
app.use('/api/v1', v1Router);

// Error Handling
app.use(errorHandler);

export default app;
