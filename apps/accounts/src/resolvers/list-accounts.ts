import { logger } from '@servitude/logger';
import { QueryResolvers } from '../generated/graphql';
import Accounts from '../models/accounts.model';

export const listAccounts: NonNullable<QueryResolvers['listAccounts']> = async (
  _parent,
  args,
  ctx,
) => {
  try {
    const accounts = await Accounts.find({ userId: ctx.userId }).lean();
    return accounts;
  } catch (error) {
    logger.error('Error fetching accounts:', error);
    throw new Error('Failed to fetch accounts');
  }
};
