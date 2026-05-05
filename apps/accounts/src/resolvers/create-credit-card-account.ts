import { logger } from '@servitude/logger';
import { MutationResolvers, AccountType } from '../generated/graphql';
import Accounts from '../models/accounts.model';

export const createCreditCardAccount: NonNullable<
  MutationResolvers['createCreditCardAccount']
> = async (_parent, args, ctx) => {
  try {
    const account = await Accounts.create({
      userId: ctx.userId,
      accountType: AccountType.CreditCard,
      ...args,
    });

    return account;
  } catch (error) {
    logger.error('Error creating credit card account:', error);
    throw new Error('Failed to create credit card account');
  }
};
