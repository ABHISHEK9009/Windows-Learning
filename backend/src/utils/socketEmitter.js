/**
 * Emits a data update event to specific users
 * @param {object} io - Socket.io instance
 * @param {string|string[]} userIds - Single user ID or array of user IDs
 * @param {string} dataType - Type of data updated (e.g., 'wallet', 'sessions', 'requirements')
 * @param {object} [payload] - Optional payload with more details
 */
export const emitDataUpdate = (io, userIds, dataType, payload = {}) => {
  if (!io) return;

  const ids = Array.isArray(userIds) ? userIds : [userIds];
  
  ids.forEach(userId => {
    io.to(`user:${userId}`).emit('data_update', {
      type: dataType,
      ...payload,
      timestamp: new Date()
    });
  });
};
