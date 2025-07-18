import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const dbInstance = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connected to MongoDB: ${dbInstance.connection.host}`);
    } catch (error) {
        console.error(`Error While Connecting to DB: ${error.message}`);
        process.exit(1);
    }
}