import { logger } from '@servitude/logger';
import { AccountType, MutationResolvers } from '../generated/graphql';
import Accounts from '../models/accounts.model';

export const createSavingsAccount: NonNullable<
  MutationResolvers['createSavingsAccount']
> = async (_parent, args, ctx) => {
  try {
    const account = await Accounts.create({
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
