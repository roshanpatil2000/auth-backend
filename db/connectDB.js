import mongoose from 'mongoose';
import logger from '../utils/logger.js';

export const connectDB = async () => {
    const mongouri = process.env.MONGO_URI;
    console.log('mongouri==>', mongouri)
    try {
        const conn = await mongoose.connect(`${mongouri}`);
        // console.log(`MongoDB Connected: ${conn.connection.host}`); 
        logger.info("⏳ MongoDB connecting...");
        logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        // console.log("Error connecting to MongoDB: ", error.message);
        logger.error(`❌ MongoDB connection failed: ${err.message}`);
        process.exit(1); //failure
    }
}