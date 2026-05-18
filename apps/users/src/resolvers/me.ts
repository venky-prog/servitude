import { logger } from '@servitude/logger';
import { QueryResolvers } from '../generated/graphql';
import User from '../models/user.model';

export const me: NonNullable<QueryResolvers['me']> = async (
  parent,
  args,
  { userId },
) => {
  try {
    const user = await User.findById(userId).lean();
    if (!user) {
      throw new Error('User not found!');
    }
    return user;
  } catch (error) {
    logger.error('Error fetching user:', error);
    throw new Error('Failed to fetch user');
  }
};
