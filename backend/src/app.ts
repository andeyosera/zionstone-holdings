import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env';

const app = express();

// Security middleware
app.use(helmet());

// CORS — allow our frontend to talk to this API
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}));

// Parse incoming JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log every request in development
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Health check — always have this in production
app.get('/health', (_req, res) => {
  res.json({ 
    status: 'ok', 
    environment: config.nodeEnv,
    timestamp: new Date().toISOString() 
  });
});

// 404 handler for unknown routes
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

export default app;