import prisma from '../../config/db.js';

export const createProposal = async (mentorId, data) => {
  const { requirementId, coverLetter, proposedRate } = data;
  const user = await prisma.user.findUnique({
    where: { id: mentorId },
    include: { mentorProfile: true }
  });

  return await prisma.proposal.create({
    data: {
      mentorId: user.mentorProfile.id,
      requirementId,
      coverLetter,
      proposedRate: parseFloat(proposedRate)
    }
  });
};

export const getMentorProposals = async (mentorId) => {
  const user = await prisma.user.findUnique({
    where: { id: mentorId },
    include: { mentorProfile: true }
  });

  return await prisma.proposal.findMany({
    where: { mentorId: user.mentorProfile.id },
    include: { requirement: true }
  });
};

export const acceptProposal = async (proposalId) => {
  return await prisma.$transaction(async (tx) => {
    const proposal = await tx.proposal.update({
      where: { id: proposalId },
      data: { isAccepted: true },
      include: { requirement: true }
    });

    const session = await tx.session.create({
      data: {
        mentorId: proposal.mentorId,
        learnerId: proposal.requirement.learnerId,
        startTime: new Date(),
        endTime: new Date(Date.now() + 3600000),
        status: 'CONFIRMED',
        topic: proposal.requirement.title,
        amount: proposal.proposedRate,
        meetingLink: 'https://meet.jit.si/' + proposal.id,
      },
    });

    return { proposal, session };
  });
};

export const rejectProposal = async (proposalId) => {
  return await prisma.proposal.update({
    where: { id: proposalId },
    data: { isAccepted: false }
  });
};
