import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
  PORT: number;
  MONGODB_URI: string;
  SECRET_KEY: string;
}

const getEnv = (): EnvConfig => {
  if (!process.env['MONGODB_URI'] || !process.env['SECRET_KEY']) {
    throw new Error("Missing required environment variables");
  }

  return {
    PORT: process.env['PORT'] ? parseInt(process.env['PORT'], 10) : 5001,
    MONGODB_URI: process.env['MONGODB_URI'],
    SECRET_KEY: process.env['SECRET_KEY'],
  };
};

export const env = getEnv();