import { logger } from '@servitude/logger';
import { MutationResolvers, AccountType } from '../generated/graphql';
import Account from '../models/account.model';

export const createEMIAccount: NonNullable<
  MutationResolvers['createEMIAccount']
> = async (_parent, args, ctx) => {
  try {
    const account = await Account.create({
      userId: ctx.userId,
      accountType: AccountType.Emi,
      ...args,
    });

    return account;
  } catch (error) {
    logger.error('Error creating EMI account:', error);
    throw new Error('Failed to create EMI account');
  }
};
