const sessionHandler = (io, socket) => {
  socket.on('join_session', ({ sessionId }) => {
    socket.join(`session:${sessionId}`);
    socket.to(`session:${sessionId}`).emit('user_joined', { userId: socket.userId });
  });

  socket.on('leave_session', ({ sessionId }) => {
    socket.leave(`session:${sessionId}`);
    socket.to(`session:${sessionId}`).emit('user_left', { userId: socket.userId });
  });

  // These would typically be triggered by the backend API, not directly from the client
  // but included here for completeness of the real-time flow
  socket.on('session_started', ({ sessionId }) => {
    io.to(`session:${sessionId}`).emit('session_status_update', { status: 'STARTED' });
  });

  socket.on('session_ended', ({ sessionId }) => {
    io.to(`session:${sessionId}`).emit('session_status_update', { status: 'COMPLETED' });
  });
};

export default sessionHandler;
