import mongoose from 'mongoose'
import { DB_NAME } from '../constant.js';

const connectDB = async () => {
    try {
        const connectInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log(`\nMongoDB Connected successfully || DB Host :${connectInstance.connection.host}`);
    } catch (error) {
        console.log('Error connecting to MongoDB', error);
        process.exit(1);
    }
}

export default  connectDB;
