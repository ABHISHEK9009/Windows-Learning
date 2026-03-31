import prisma from '../../config/db.js';

export const getAllCategories = async () => {
  return await prisma.category.findMany({
    include: {
      _count: {
        select: { skills: true }
      }
    }
  });
};

export const getCategoryById = async (id) => {
  return await prisma.category.findUnique({
    where: { id },
    include: {
      skills: true
    }
  });
};
