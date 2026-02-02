import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/venezuela-monitor',
  },
  
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  
  apis: {
    gemini: process.env.GEMINI_API_KEY || '',
    newsApi: process.env.NEWS_API_KEY || '',
    twitter: process.env.TWITTER_BEARER_TOKEN || '',
    facebook: process.env.FACEBOOK_ACCESS_TOKEN || '',
    telegram: process.env.TELEGRAM_BOT_TOKEN || '',
    tiktok: process.env.TIKTOK_API_KEY || '',
    googleNews: process.env.GOOGLE_NEWS_API_KEY || '',
    googleTranslate: process.env.GOOGLE_TRANSLATE_API_KEY || '',
  },
  
  alerts: {
    webhookUrl: process.env.ALERT_WEBHOOK_URL || '',
  },
  
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  },
  
  monitoring: {
    intervalMinutes: 5,
    keywords: [
      'Venezuela',
      'Maduro',
      'Caracas',
      'PDVSA',
      'Petro',
      'Guaidó',
      'Guaido',
      'Oposición',
      'Opposition',
      'Crisis Venezuela',
      'Sanctions Venezuela',
      'Venezuela economy',
      'Venezuela migration',
      'Venezuela humanitarian',
    ],
  },
};
