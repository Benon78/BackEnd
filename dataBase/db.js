import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

const mongoose_url = process.env.MONGOOSE_URL;


export const getDataBaseConnection = async () =>{
    try {
        await mongoose.connect(`${mongoose_url}`);
        console.log('Mongoose DataBase Connected Successfully!')
    } catch (error) {
        console.log('Error --->', error);
        process.exit(1);
    }
}



