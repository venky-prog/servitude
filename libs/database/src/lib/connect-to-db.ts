import mongoose from 'mongoose';
import { logger } from '@servitude/logger';

let isConnected = false;
export async function connectToDb(uri: string) {
  if (isConnected) return;

  try {
    await mongoose.connect(uri);
    mongoose.connection.on('error', (error) => {
      logger.error(error);
    });
    mongoose.connection.on('connected', () => {
      logger.info('Connected to MongoDB');
    });
    mongoose.connection.on('disconnected', () => {
      logger.warn('Disconnected from MongoDB');
    });
    isConnected = true;
  } catch (error) {
    logger.error('Failed to connect to MongoDB', error);
  }
}
