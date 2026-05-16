import { logger } from '@servitude/logger';
import { QueryResolvers } from '../generated/graphql';
import { Transactions } from '../models/transactions.model';
import { Types, QueryFilter } from 'mongoose';

export const listTransactions: NonNullable<
  QueryResolvers['listTransactions']
> = async (_, { first, after }, { userId }) => {
  if (!userId) {
    logger.error('Unauthorized access to listTransactions');
    throw new Error('Unauthorized');
  }
  const filter: QueryFilter<any> = {
    userId,
  };

  if (after) {
    filter._id = {
      $lt: new Types.ObjectId(after),
    };
  }
  const limit = first + 1;

  const docs = await Transactions.find(filter)
    .sort({ _id: -1 })
    .limit(limit)
    .lean();

  const hasNextPage = docs.length === limit;

  if (hasNextPage) {
    docs.pop();
  }
  
  return {
    edges: docs.map((doc) => ({
      cursor: doc._id.toString(),
      node: doc,
    })),
    pageInfo: {
      hasNextPage,
      hasPreviousPage: false,
      startCursor: docs.at(0)?._id.toString(),
      endCursor: docs.at(-1)?._id.toString(),
    },
  };
};
