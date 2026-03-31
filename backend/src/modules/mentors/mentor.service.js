import prisma from '../../config/db.js';

export const getAllMentors = async (filters) => {
  const { skill, minPrice, maxPrice, page = 1, limit = 10, sortBy = 'rating' } = filters;

  const where = {
    isVerified: true,
    ...(minPrice || maxPrice ? {
      hourlyRate: {
        ...(minPrice ? { gte: parseFloat(minPrice) } : {}),
        ...(maxPrice ? { lte: parseFloat(maxPrice) } : {}),
      }
    } : {}),
    ...(skill ? {
      skills: {
        some: {
          skill: {
            name: { contains: skill, mode: 'insensitive' }
          }
        }
      }
    } : {}),
  };

  const orderBy = sortBy === 'price_asc' ? { hourlyRate: 'asc' } :
                 sortBy === 'price_desc' ? { hourlyRate: 'desc' } :
                 { reviews: { _count: 'desc' } };

  return await prisma.mentorProfile.findMany({
    where,
    include: {
      user: { select: { name: true, email: true } },
      skills: { include: { skill: true } },
      reviews: true,
      _count: { select: { reviews: true } }
    },
    orderBy,
    skip: (parseInt(page) - 1) * parseInt(limit),
    take: parseInt(limit),
  });
};

export const getMentorById = async (id) => {
  return await prisma.mentorProfile.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true } },
      skills: { include: { skill: true } },
      reviews: {
        include: {
          learner: { include: { user: { select: { name: true } } } },
        },
      },
      availability: true,
    },
  });
};

export const updateMentorAvailability = async (userId, availabilityData) => {
  const mentor = await prisma.mentorProfile.findUnique({ where: { userId } });

  if (!mentor) throw new Error('Mentor profile not found');

  const { schedule } = availabilityData;

  const availabilityPromises = Object.entries(schedule).map(([day, data]) => {
    return prisma.mentorAvailability.upsert({
      where: { mentorId_day: { mentorId: mentor.id, day } },
      create: { mentorId: mentor.id, day, startTime: data.start, endTime: data.end, isAvailable: data.active },
      update: { startTime: data.start, endTime: data.end, isAvailable: data.active },
    });
  });

  return await Promise.all(availabilityPromises);
};

export const saveMentor = async (userId, mentorId) => {
  const learner = await prisma.learnerProfile.findUnique({
    where: { userId },
  });

  return await prisma.savedMentor.create({
    data: { learnerId: learner.id, mentorId },
  });
};

export const getSavedMentors = async (userId) => {
  const learner = await prisma.learnerProfile.findUnique({
    where: { userId },
  });

  return await prisma.savedMentor.findMany({
    where: { learnerId: learner.id },
    include: {
      mentor: {
        include: {
          user: { select: { name: true } },
          skills: { include: { skill: true } },
        },
      },
    },
  });
};
