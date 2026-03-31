import http from 'http';
import app from './app.js';
import config from './config/env.js';
import setupSocketIO from './socket/index.js';
import prisma from './config/db.js';

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('[Process] UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  console.error(err.stack);
  process.exit(1);
});

const PORT = config.port || 3000;
const server = http.createServer(app);

// Initialize Socket.io
const io = setupSocketIO(server);

// Make io accessible globally
app.set('io', io);

// Handle port errors
server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`[Server] ${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`[Server] ${bind} is already in use. Please close the other process using this port.`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`[Server] Running on port ${PORT}`);
  console.log(`[API] Version 1: http://localhost:${PORT}/api/v1`);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('[Process] UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Graceful shutdown on termination signals
const gracefulShutdown = () => {
  console.log('[Server] Termination signal received. Closing server gracefully...');
  server.close(async () => {
    console.log('[Server] HTTP server closed.');
    try {
      await prisma.$disconnect();
      console.log('[Prisma] Database connection closed.');
      process.exit(0);
    } catch (err) {
      console.error('[Prisma] Error during database disconnection:', err);
      process.exit(1);
    }
  });

  // Force shutdown after 10s if graceful shutdown fails
  setTimeout(() => {
    console.error('[Server] Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
