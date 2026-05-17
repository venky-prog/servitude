import { logger } from '@servitude/logger';
import { QueryResolvers } from '../generated/graphql';
import User from '../models/user.model';

export const me: NonNullable<QueryResolvers['me']> = async () => {
  try {
    const user = await User.findById('64b8c9e5f1a2c9b1d2e3f4a5').lean();
    if (!user) {
      throw new Error('User not found!');
    }
    return user;
  } catch (error) {
    logger.error('Error fetching user:', error);
    throw new Error('Failed to fetch user');
  }
};
