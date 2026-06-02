import app from './app';
import { config } from './config/env';

const server = app.listen(config.port, () => {
  console.log(`🚀 Zionstone API running on port ${config.port}`);
  console.log(`📦 Environment: ${config.nodeEnv}`);
});

// Graceful shutdown — important for production Docker containers
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});