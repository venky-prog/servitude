import { logger } from '@servitude/logger';
import { MutationResolvers } from '../generated/graphql';
import { Transactions } from '../models/transactions.model';

export const updateTransaction: NonNullable<
  MutationResolvers['updateTransaction']
> = async (_, { _id, input }, ctx) => {
  if (!ctx.userId) {
    logger.error('Unauthorized access to updateTransaction');
    throw new Error('Unauthorized');
  }
  const transaction = await Transactions.findOneAndUpdate(
    { _id, userId: ctx.userId },
    { $set: input },
    { new: true },
  );
  if (!transaction) {
    logger.error('Transaction not found');
    throw new Error('Transaction not found');
  }
  return transaction;
};
