import prisma from '../../config/db.js';

export const createRequirement = async (learnerId, data) => {
  const { title, description, budget } = data;
  const user = await prisma.user.findUnique({
    where: { id: learnerId },
    include: { learnerProfile: true }
  });

  return await prisma.learnerRequirement.create({
    data: {
      learnerId: user.learnerProfile.id,
      title,
      description,
      budget: budget ? parseFloat(budget) : null
    }
  });
};

export const getAllRequirements = async () => {
  return await prisma.learnerRequirement.findMany({
    include: {
      learner: { include: { user: { select: { name: true } } } },
      _count: { select: { proposals: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const getRequirementById = async (id) => {
  return await prisma.learnerRequirement.findUnique({
    where: { id },
    include: {
      learner: { include: { user: { select: { name: true } } } },
      proposals: {
        include: { mentor: { include: { user: { select: { name: true } } } } }
      }
    }
  });
};

export const deleteRequirement = async (id) => {
  return await prisma.learnerRequirement.delete({ where: { id } });
};
