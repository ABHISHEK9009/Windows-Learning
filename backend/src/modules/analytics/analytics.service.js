import prisma from '../../config/db.js';

export const getLearnerAnalytics = async (learnerId) => {
  const [totalSessions, completedSessions, totalSpent] = await Promise.all([
    prisma.session.count({ where: { learnerId } }),
    prisma.session.count({ where: { learnerId, status: 'COMPLETED' } }),
    prisma.transaction.aggregate({
      where: { wallet: { userId: learnerId }, type: 'PAYMENT' },
      _sum: { amount: true }
    })
  ]);

  return {
    totalSessions,
    completedSessions,
    totalSpent: totalSpent._sum.amount || 0
  };
};

export const getMentorAnalytics = async (mentorId) => {
  const user = await prisma.user.findUnique({
    where: { id: mentorId },
    include: { mentorProfile: true }
  });

  const [totalSessions, completedSessions, totalEarnings] = await Promise.all([
    prisma.session.count({ where: { mentorId: user.mentorProfile.id } }),
    prisma.session.count({ where: { mentorId: user.mentorProfile.id, status: 'COMPLETED' } }),
    prisma.transaction.aggregate({
      where: { wallet: { userId: mentorId }, type: 'DEPOSIT' },
      _sum: { amount: true }
    })
  ]);

  return {
    totalSessions,
    completedSessions,
    totalEarnings: totalEarnings._sum.amount || 0
  };
};
