import { config } from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
    config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });
}

export const {
    PORT, NODE_ENV, SERVER_URL,
    JWT_SECRET, JWT_EXPIRES_IN,
    ARCJET_ENV, ARCJET_KEY,
    QSTASH_TOKEN, QSTASH_URL,
    EMAIL_PASSWORD,
    FRONTEND_URL,
} = process.env;

export const DB_URI = process.env.DB_URI || process.env.MONGODB_URI;
