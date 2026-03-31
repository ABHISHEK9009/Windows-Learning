import { Server } from 'socket.io';
import { authenticate } from './middleware/authenticate.js';
import chatHandler from './handlers/chatHandler.js';
import notificationHandler from './handlers/notificationHandler.js';
import sessionHandler from './handlers/sessionHandler.js';
import presenceHandler from './handlers/presenceHandler.js';

const setupSocketIO = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:8080', // Default for dev
      credentials: true
    }
  });

  io.use(authenticate);

  io.on('connection', (socket) => {
    console.log(`User ${socket.userId} connected as ${socket.userRole}`);

    socket.join(`user:${socket.userId}`);
    if (socket.userRole) {
      socket.join(`role:${socket.userRole}`);
    }

    chatHandler(io, socket);
    notificationHandler(io, socket);
    sessionHandler(io, socket);
    presenceHandler(io, socket);

    socket.on('disconnect', () => {
      console.log(`User ${socket.userId} disconnected`);
      socket.leave(`user:${socket.userId}`);
    });
  });

  return io;
};

export default setupSocketIO;
