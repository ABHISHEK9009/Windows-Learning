import prisma from '../../config/db.js';

export const getAllUsers = async () => {
  return await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });
};

export const getUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      learnerProfile: { include: { skills: { include: { skill: true } } } },
      mentorProfile: { include: { skills: { include: { skill: true } } } },
      wallet: true,
    },
  });
};

export const updateUserProfile = async (userId, data) => {
  const { name, bio, role, profilePicture, ...profileData } = data;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  return await prisma.user.update({
    where: { id: userId },
    data: {
      ...(name && { name }),
      ...(profilePicture && { profilePicture }),
      ...(role && { role }),
      ...(role === 'LEARNER'
        ? {
            learnerProfile: {
              upsert: {
                where: { userId },
                create: { bio: bio || '', experienceLevel: profileData.experienceLevel || '' },
                update: {
                  ...(bio !== undefined && { bio }),
                  ...(profileData.experienceLevel !== undefined && { experienceLevel: profileData.experienceLevel }),
                },
              },
            },
          }
        : role === 'MENTOR'
        ? {
            mentorProfile: {
              upsert: {
                where: { userId },
                create: {
                  bio: bio || '',
                  title: profileData.title || '',
                  location: profileData.location || '',
                  languages: profileData.languages || '',
                  hourlyRate: parseFloat(profileData.hourlyRate) || 0,
                  experience: parseInt(profileData.experience, 10) || 0,
                  company: profileData.company || '',
                  education: profileData.education || '',
                  linkedinUrl: profileData.linkedinUrl || '',
                  portfolioUrl: profileData.portfolioUrl || '',
                },
                update: {
                  ...(bio !== undefined && { bio }),
                  ...(profileData.title !== undefined && { title: profileData.title }),
                  ...(profileData.location !== undefined && { location: profileData.location }),
                  ...(profileData.languages !== undefined && { languages: profileData.languages }),
                  ...(profileData.hourlyRate !== undefined && { hourlyRate: parseFloat(profileData.hourlyRate) || 0 }),
                  ...(profileData.experience !== undefined && { experience: parseInt(profileData.experience, 10) || 0 }),
                  ...(profileData.company !== undefined && { company: profileData.company }),
                  ...(profileData.education !== undefined && { education: profileData.education }),
                  ...(profileData.linkedinUrl !== undefined && { linkedinUrl: profileData.linkedinUrl }),
                  ...(profileData.portfolioUrl !== undefined && { portfolioUrl: profileData.portfolioUrl }),
                },
              },
            },
          }
        : {}),
    },
    include: {
      learnerProfile: { include: { skills: { include: { skill: true } } } },
      mentorProfile: { include: { skills: { include: { skill: true } } } },
      wallet: true,
    },
  });
};

// ─── Admin: all mentors with computed fields ──────────────────────────────────
export const getAllMentors = async (filters = {}) => {
  const { status } = filters;

  let where = {};
  if (status === 'verified') {
    where = { isVerified: true };
  } else if (status === 'rejected') {
    where = { isVerified: false, rejectionReason: { not: null } };
  } else if (status === 'pending') {
    where = { isVerified: false, rejectionReason: null };
  }

  const mentors = await prisma.mentorProfile.findMany({
    where,
    include: {
      user: { select: { id: true, email: true, name: true, profilePicture: true, createdAt: true } },
      skills: { include: { skill: true } },
      reviews: { select: { rating: true } },
      sessions: { select: { id: true, status: true, amount: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return mentors.map((m) => {
    const ratings = m.reviews.map((r) => r.rating);
    const avgRating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
    const totalEarnings = m.sessions
      .filter((s) => s.status === 'COMPLETED')
      .reduce((sum, s) => sum + Number(s.amount || 0), 0);

    const verificationStatus = m.isVerified
      ? 'verified'
      : m.rejectionReason
      ? 'rejected'
      : 'pending';

    return {
      id: m.id,
      userId: m.userId,
      user: m.user,
      title: m.title || '',
      bio: m.bio || '',
      expertise: m.skills.map((s) => s.skill?.name).filter(Boolean),
      experience: m.experience || 0,
      company: m.company || '',
      education: m.education || '',
      linkedinUrl: m.linkedinUrl || '',
      portfolioUrl: m.portfolioUrl || '',
      hourlyRate: Number(m.hourlyRate || 0),
      totalSessions: m.sessions.length,
      averageRating: parseFloat(avgRating.toFixed(1)),
      totalEarnings,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
      verificationStatus,
      verificationDetails: { rejectionReason: m.rejectionReason || null },
    };
  });
};

export const getUnverifiedMentors = async () => {
  return await prisma.mentorProfile.findMany({
    where: { isVerified: false, rejectionReason: null },
    include: { user: { select: { id: true, email: true, name: true } } },
  });
};

export const verifyMentor = async (mentorProfileId) => {
  return await prisma.mentorProfile.update({
    where: { id: mentorProfileId },
    data: { isVerified: true, rejectionReason: null },
  });
};

export const rejectMentor = async (mentorProfileId, reason) => {
  return await prisma.mentorProfile.update({
    where: { id: mentorProfileId },
    data: { isVerified: false, rejectionReason: reason },
  });
};

export const getAdminStats = async () => {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    totalUsers, activeUsers, newUsersThisMonth,
    totalMentors, verifiedMentors, pendingMentors, rejectedMentors,
    totalSessions, completedSessions, cancelledSessions, sessionsThisMonth,
    earningsResult, earningsThisMonth,
    totalReviews, fiveStarReviews, ratingAggregate,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: { not: 'ADMIN' } } }),
    prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.mentorProfile.count(),
    prisma.mentorProfile.count({ where: { isVerified: true } }),
    prisma.mentorProfile.count({ where: { isVerified: false, rejectionReason: null } }),
    prisma.mentorProfile.count({ where: { isVerified: false, rejectionReason: { not: null } } }),
    prisma.session.count(),
    prisma.session.count({ where: { status: 'COMPLETED' } }),
    prisma.session.count({ where: { status: 'CANCELLED' } }),
    prisma.session.count({ where: { startTime: { gte: startOfMonth } } }),
    prisma.session.aggregate({ _sum: { amount: true }, where: { status: 'COMPLETED' } }),
    prisma.session.aggregate({ _sum: { amount: true }, where: { status: 'COMPLETED', startTime: { gte: startOfMonth } } }),
    prisma.review.count(),
    prisma.review.count({ where: { rating: 5 } }),
    prisma.review.aggregate({ _avg: { rating: true } }),
  ]);

  const totalEarnings = Number(earningsResult._sum.amount || 0);

  return {
    users: { total: totalUsers, active: activeUsers, newThisMonth: newUsersThisMonth, growth: 0 },
    mentors: { total: totalMentors, verified: verifiedMentors, pending: pendingMentors, rejected: rejectedMentors, active: verifiedMentors, growth: 0 },
    sessions: { total: totalSessions, completed: completedSessions, cancelled: cancelledSessions, thisMonth: sessionsThisMonth, growth: 0 },
    earnings: { total: totalEarnings, platformFee: totalEarnings * 0.1, mentorPayout: totalEarnings * 0.9, thisMonth: Number(earningsThisMonth._sum.amount || 0), growth: 0 },
    reviews: { total: totalReviews, averageRating: parseFloat((ratingAggregate._avg.rating || 0).toFixed(1)), fiveStar: fiveStarReviews },
  };
};

export const deleteUser = async (id) => {
  return await prisma.user.delete({ where: { id } });
};
