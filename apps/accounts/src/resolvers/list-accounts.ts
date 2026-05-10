import { logger } from '@servitude/logger';
import { QueryResolvers } from '../generated/graphql';
import Account from '../models/account.model';

export const listAccounts: NonNullable<QueryResolvers['listAccounts']> = async (
  _parent,
  args,
  ctx,
) => {
  try {
    const accounts = await Account.find({ userId: ctx.userId })
      .limit(args.filter?.limit ?? 10)
      .skip(args.filter?.offset ?? 0)
      .lean();
    return accounts;
  } catch (error) {
    logger.error('Error fetching accounts:', error);
    throw new Error('Failed to fetch accounts');
  }
};
