import { logger } from '@servitude/logger';
import { QueryResolvers } from '../generated/graphql';
import Accounts from '../models/accounts.model';

export const getAccount: NonNullable<QueryResolvers['getAccount']> = async (
  _parent,
  args,
  ctx,
) => {
  try {
    const account = await Accounts.findById(args.id).lean();
    if (!account) {
      throw new Error('Account not found');
    }
    return account;
  } catch (error) {
    logger.error('Error fetching account:', error);
    throw new Error('Failed to fetch account');
  }
};
