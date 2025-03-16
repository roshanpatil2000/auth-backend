import mongoose from 'mongoose';

export const connectDB = async () => {
    const mongouri= process.env.MONGO_URI;
    console.log('mongouri==>', mongouri)
    try {
        const conn = await mongoose.connect(`${mongouri}`);
        console.log(`MongoDB Connected: ${conn.connection.host}`); 
    } catch (error) {
        console.log("Error connecting to MongoDB: ",error.message);
        process.exit(1); //failure
    }
}