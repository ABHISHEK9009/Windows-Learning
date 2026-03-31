import * as chatService from './chat.service.js';
import { sendSuccess } from '../../utils/responseHandler.js';

export const getChatHistory = async (req, res, next) => {
  try {
    const messages = await chatService.getMessages(req.user.userId, req.params.userId);
    return sendSuccess(res, messages, 'Chat history retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getConversations = async (req, res, next) => {
  try {
    const conversations = await chatService.getConversations(req.user.userId);
    return sendSuccess(res, conversations, 'Chat conversations retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const { receiverId } = req.body;
    const content = req.body?.content ?? req.body?.message;

    if (!receiverId || !content) {
      const error = new Error('receiverId and message content are required');
      error.statusCode = 400;
      throw error;
    }

    const savedMessage = await chatService.createMessage(req.user.userId, receiverId, content);

    const io = req.app.get('io');
    if (io) {
      io.to(`user:${receiverId}`).emit('receive_message', savedMessage);
      io.to(`user:${req.user.userId}`).emit('message_sent', savedMessage);
    }

    return sendSuccess(res, savedMessage, 'Message sent successfully');
  } catch (error) {
    next(error);
  }
};