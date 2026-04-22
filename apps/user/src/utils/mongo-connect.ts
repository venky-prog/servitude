import mongoose from "mongoose";

export const connectToMongoDB = async (mongoUri: string) => {
  try {
    const connection = await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
    connection.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    return connection;
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    throw err;
  }
};