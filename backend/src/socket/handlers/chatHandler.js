import prisma from '../../config/db.js';
import { getOrCreateConversation } from '../../modules/chat/chat.service.js';

const chatHandler = (io, socket) => {
  // Send message
  socket.on('send_message', async (data) => {
    try {
      const { receiverId, content } = data;
      const senderId = socket.userId;

      const conversationId = await getOrCreateConversation(senderId, receiverId);

      // 2. Save message to database
      const savedMessage = await prisma.message.create({
        data: {
          senderId,
          receiverId,
          conversationId,
          content
        }
      });

      // 3. Emit to receiver
      io.to(`user:${receiverId}`).emit('receive_message', savedMessage);
      
      // 4. Send confirmation to sender
      socket.emit('message_sent', savedMessage);

    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Typing indicator
  socket.on('typing_start', ({ receiverId }) => {
    socket.to(`user:${receiverId}`).emit('user_typing', {
      userId: socket.userId,
      isTyping: true
    });
  });

  socket.on('typing_stop', ({ receiverId }) => {
    socket.to(`user:${receiverId}`).emit('user_typing', {
      userId: socket.userId,
      isTyping: false
    });
  });

  // Mark messages as read (simplified for now)
  socket.on('mark_read', async ({ conversationId }) => {
    // In a full implementation, you'd update an 'isRead' flag on messages
    socket.emit('messages_read', { conversationId });
  });
};

export default chatHandler;
