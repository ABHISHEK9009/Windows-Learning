import prisma from '../../config/db.js';

export const createReview = async (userId, data) => {
  const { sessionId, rating, comment } = data;

  const learner = await prisma.learnerProfile.findUnique({
    where: { userId },
  });

  if (!learner) {
    const error = new Error('Learner profile not found');
    error.statusCode = 404;
    throw error;
  }

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { review: true },
  });

  if (!session) {
    const error = new Error('Session not found');
    error.statusCode = 404;
    throw error;
  }
  if (session.learnerId !== learner.id) {
    const error = new Error('Forbidden');
    error.statusCode = 403;
    throw error;
  }
  if (session.status !== 'COMPLETED') {
    const error = new Error('Only completed sessions can be reviewed');
    error.statusCode = 400;
    throw error;
  }
  if (session.review) {
    const error = new Error('Review already submitted');
    error.statusCode = 400;
    throw error;
  }

  return await prisma.review.create({
    data: {
      sessionId,
      mentorId: session.mentorId,
      learnerId: learner.id,
      rating: parseInt(rating),
      comment,
    },
  });
};

export const getMentorReviews = async (mentorId) => {
  return await prisma.review.findMany({
    where: { mentorId },
    include: {
      session: true,
      learner: { include: { user: { select: { name: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  });
};
