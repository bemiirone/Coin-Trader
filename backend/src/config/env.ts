import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
  PORT: number;
  MONGODB_URI: string;
  SECRET_KEY: string;
  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_USER: string;
  SMTP_PASS: string;
  SMTP_FROM: string;
  FRONTEND_URL: string;
  CMC_API_KEY: string;
  CMC_API_URL: string;
}

const getEnv = (): EnvConfig => {
  if (!process.env['MONGODB_URI'] || !process.env['SECRET_KEY']) {
    throw new Error("Missing required environment variables");
  }

  return {
    PORT: process.env['PORT'] ? parseInt(process.env['PORT'], 10) : 5001,
    MONGODB_URI: process.env['MONGODB_URI'],
    SECRET_KEY: process.env['SECRET_KEY'],
    SMTP_HOST: process.env['SMTP_HOST'] || 'smtp.gmail.com',
    SMTP_PORT: process.env['SMTP_PORT'] ? parseInt(process.env['SMTP_PORT'], 10) : 587,
    SMTP_USER: process.env['SMTP_USER'] || '',
    SMTP_PASS: process.env['SMTP_PASS'] || '',
    SMTP_FROM: process.env['SMTP_FROM'] || 'noreply@cryptotrader.com',
    FRONTEND_URL: process.env['FRONTEND_URL'] || 'http://localhost:4200',
    CMC_API_KEY: process.env['CMC_API_KEY'] || '',
    CMC_API_URL: process.env['CMC_API_URL'] || 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
  };
};

export const env = getEnv();
