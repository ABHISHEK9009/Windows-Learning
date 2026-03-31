import prisma from '../../config/db.js';

export const createSession = async (
  learnerId,
  mentorId,
  startTime,
  endTime,
  topic,
  meetingLink
) => {
  const start = new Date(startTime);
  const end = new Date(endTime);

  // Check for double booking
  const existingSession = await prisma.session.findFirst({
    where: {
      mentorId,
      status: { not: 'CANCELLED' },
      OR: [
        { startTime: { lte: start }, endTime: { gt: start } },
        { startTime: { lt: end }, endTime: { gte: end } },
      ],
    },
  });

  if (existingSession) {
    const error = new Error('Slot already booked');
    error.statusCode = 400;
    throw error;
  }

  return await prisma.$transaction(async (tx) => {
    const mentor = await tx.mentorProfile.findUnique({ where: { id: mentorId } });
    if (!mentor) throw new Error('Mentor not found');

    const learner = await tx.learnerProfile.findUnique({
      where: { userId: learnerId },
    });
    if (!learner) throw new Error('Learner profile not found');

    const amount = mentor.hourlyRate || 0;

    const wallet = await tx.wallet.update({
      where: { userId: learnerId },
      data: { balance: { decrement: amount } },
    });

    if (wallet.balance < 0) throw new Error('Insufficient wallet balance');

    const session = await tx.session.create({
      data: {
        mentorId,
        learnerId: learner.id,
        startTime: start,
        endTime: end,
        topic,
        amount,
        meetingLink,
        status: 'PENDING',
      },
    });

    await tx.transaction.create({
      data: {
        walletId: wallet.id,
        amount: -amount,
        type: 'PAYMENT',
        description: `Session payment for topic: ${topic || 'General Consultation'}`,
        referenceId: session.id,
      },
    });

    return session;
  });
};

export const getLearnerSessions = async (userId) => {
  const learner = await prisma.learnerProfile.findUnique({
    where: { userId },
  });

  return await prisma.session.findMany({
    where: { learnerId: learner.id },
    include: {
      mentor: { include: { user: { select: { name: true } } } },
      review: true,
    },
    orderBy: { startTime: 'desc' },
  });
};

export const getMentorSessions = async (userId) => {
  // userId is the user's ID, we need to get mentorProfileId first
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { mentorProfile: true },
  });

  return await prisma.session.findMany({
    where: { mentorId: user.mentorProfile.id },
    include: {
      mentor: { include: { user: { select: { name: true } } } },
      review: true,
    },
    orderBy: { startTime: 'desc' },
  });
};

export const updateSessionStatus = async (id, status) => {
  return await prisma.session.update({
    where: { id },
    data: { status }
  });
};
