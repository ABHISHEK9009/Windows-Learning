import prisma from '../../config/db.js';

export const getWalletByUserId = async (userId) => {
  return await prisma.wallet.findUnique({
    where: { userId },
    include: { transactions: { orderBy: { createdAt: 'desc' } } }
  });
};

export const depositFunds = async (userId, amount, description = 'Funds deposit', referenceId = null) => {
  return await prisma.$transaction(async (tx) => {
    const wallet = await tx.wallet.update({
      where: { userId },
      data: { balance: { increment: parseFloat(amount) } },
    });

    await tx.transaction.create({
      data: {
        walletId: wallet.id,
        amount: parseFloat(amount),
        type: 'DEPOSIT',
        description,
        referenceId,
      },
    });
    return wallet;
  });
};

export const withdrawFunds = async (userId, amount, description = 'Funds withdrawal', referenceId = null) => {
  return await prisma.$transaction(async (tx) => {
    const wallet = await tx.wallet.update({
      where: { userId },
      data: { balance: { decrement: parseFloat(amount) } },
    });

    if (wallet.balance < 0) throw new Error('Insufficient funds');

    await tx.transaction.create({
      data: {
        walletId: wallet.id,
        amount: parseFloat(amount),
        type: 'WITHDRAWAL',
        description,
        referenceId,
      },
    });
    return wallet;
  });
};
