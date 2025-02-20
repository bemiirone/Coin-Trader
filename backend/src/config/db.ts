import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { env } from '../config/env';

dotenv.config();

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI as string);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    process.exit(1);
  }
};
