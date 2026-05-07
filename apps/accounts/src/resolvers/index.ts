import { resolvers as scalarResolvers } from 'graphql-scalars';
import { listAccounts } from './list-accounts';
import { getAccount } from './get-account';
import type { Resolvers } from '../generated/graphql';
import Accounts from '../models/accounts.model';
import { createCreditCardAccount } from './create-credit-card-account';
import { createLoanAccount } from './create-loan-account';
import { createSavingsAccount } from './create-savings-account';

const accountResolvers: Resolvers = {
  ...scalarResolvers,
  Query: {
    listAccounts,
    getAccount,
  },
  Mutation: {
    createCreditCardAccount,
    createLoanAccount,
    createSavingsAccount,
  },
  Account: {
    user: (parent:any) => ({ __typename: 'User' as const, _id: parent.userId }),
    __resolveReference: async (ref) => {
      const account = await Accounts.findById(ref._id);
      return account;
    },
  },
};

export default accountResolvers;
