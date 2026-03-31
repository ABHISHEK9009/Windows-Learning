import prisma from '../../config/db.js';

export const createNotification = async (userId, type, content) => {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        content
      }
    });
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};
