import { createNotification } from '../../modules/notifications/notification.service.js';

const notificationHandler = (io, socket) => {
  // This handler is mostly for listening to events from other parts of the app
  // and emitting them to the correct user.

  // Example of how another service would trigger a notification:
  // const io = app.get('io');
  // io.to(`user:${userId}`).emit('new_notification', notificationData);

  socket.on('get_notifications', async () => {
    try {
      const notifications = await prisma.notification.findMany({
        where: { userId: socket.userId },
        orderBy: { createdAt: 'desc' },
        take: 20
      });
      socket.emit('notifications', notifications);
    } catch (error) {
      socket.emit('error', { message: 'Failed to get notifications' });
    }
  });
};

export default notificationHandler;
