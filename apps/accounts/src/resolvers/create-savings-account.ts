import { logger } from '@servitude/logger';
import { AccountType, MutationResolvers } from '../generated/graphql';
import Account from '../models/account.model';

export const createSavingsAccount: NonNullable<
  MutationResolvers['createSavingsAccount']
> = async (_parent, args, ctx) => {
  try {
    const account = await Account.create({
      userId: ctx.userId,
      accountType: AccountType.Savings,
      ...args,
    });

    return account;
  } catch (error) {
    logger.error('Error creating savings account:', error);
    throw new Error('Failed to create savings account');
  }
};
