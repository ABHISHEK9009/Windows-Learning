import prisma from '../../config/db.js';

export const getOrCreateConversation = async (userId1, userId2) => {
  const existingConv = await prisma.conversation.findFirst({
    where: {
      AND: [
        { users: { some: { userId: userId1 } } },
        { users: { some: { userId: userId2 } } }
      ]
    }
  });

  if (existingConv) return existingConv.id;

  const newConv = await prisma.conversation.create({
    data: {
      users: {
        create: [
          { userId: userId1 },
          { userId: userId2 }
        ]
      }
    }
  });

  return newConv.id;
};

export const getMessages = async (userId1, userId2) => {
  return await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 },
      ],
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
};

export const createMessage = async (senderId, receiverId, content) => {
  const conversationId = await getOrCreateConversation(senderId, receiverId);
  return await prisma.message.create({
    data: {
      senderId,
      receiverId,
      conversationId,
      content,
    },
  });
};

export const getConversations = async (userId) => {
  // Grab most recent messages and build unique conversation entries in-memory.
  // (We keep it simple; can be optimized later with DB grouping.)
  const recentMessages = await prisma.message.findMany({
    where: {
      OR: [{ senderId: userId }, { receiverId: userId }],
    },
    orderBy: { createdAt: 'desc' },
    take: 2000,
  });

  const byOtherUserId = new Map();
  for (const m of recentMessages) {
    const otherUserId = m.senderId === userId ? m.receiverId : m.senderId;
    if (!byOtherUserId.has(otherUserId)) {
      byOtherUserId.set(otherUserId, {
        otherUserId,
        lastMessage: m.content,
        lastMessageAt: m.createdAt,
      });
    }
  }

  const otherIds = Array.from(byOtherUserId.keys());
  const otherUsers = await prisma.user.findMany({
    where: { id: { in: otherIds } },
    select: { id: true, name: true, email: true, role: true, profilePicture: true },
  });

  const userById = new Map(otherUsers.map((u) => [u.id, u]));

  return Array.from(byOtherUserId.values()).map((c) => {
    const u = userById.get(c.otherUserId);
    return {
      otherUserId: c.otherUserId,
      otherName: u?.name ?? u?.email ?? 'User',
      otherRole: u?.role ?? null,
      otherProfilePicture: u?.profilePicture ?? null,
      lastMessage: c.lastMessage,
      lastMessageAt: c.lastMessageAt,
    };
  }).sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
};