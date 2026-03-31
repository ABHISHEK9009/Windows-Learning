// In-memory store for online users. In production, use Redis.
const onlineUsers = new Map();

const presenceHandler = (io, socket) => {
  // Mark user as online
  onlineUsers.set(socket.userId, {
    socketId: socket.id,
    lastSeen: new Date()
  });

  // Broadcast to others that this user is online (optional, might be too noisy)
  // io.emit('user_status_change', { userId: socket.userId, status: 'online' });

  socket.on('get_user_status', ({ userId }) => {
    const isOnline = onlineUsers.has(userId);
    socket.emit('user_status', {
      userId,
      isOnline,
      lastSeen: isOnline ? new Date() : null // Would need DB lookup for actual last seen if offline
    });
  });

  socket.on('disconnect', () => {
    onlineUsers.delete(socket.userId);
    // io.emit('user_status_change', { userId: socket.userId, status: 'offline' });
  });
};

export default presenceHandler;
