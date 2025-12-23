import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/chat';

export const dbConnection = async () =>{
    try{
        await mongoose.connect(mongoUrl);
    }catch{
        console.log("Couldn't connect to db");
    }
}