import mongoose from 'mongoose';
import { DB_URI, NODE_ENV } from '../config/env.js';

const connectionString = DB_URI || process.env.MONGODB_URI;

if(!connectionString) {
    throw new Error('Please define DB_URI or MONGODB_URI in .env.<development/production>.local or project env vars');
}

const connectToDatabase = async () => {
    try {
        await mongoose.connect(connectionString);

        console.log(`Connected to database in ${NODE_ENV} mode`);
    } catch (error) {
        console.error('Error connecting to database: ', error);

        process.exit(1);
    }
}

export default connectToDatabase;