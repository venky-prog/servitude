import { logger } from "@servitude/logger";
import { AccountType, MutationResolvers } from "../generated/graphql";
import Accounts from "../models/accounts.model";

export const createLoanAccount: NonNullable<MutationResolvers['createLoanAccount']> = async (
  _parent,
  args,
  ctx
) => {
  try {
    const account = await Accounts.create({
      userId: ctx.userId,
      accountType: AccountType.Loan,
      ...args,
    });

    return account;
  } catch (error) {
    logger.error('Error creating loan account:', error);
    throw new Error('Failed to create loan account');
  }
};