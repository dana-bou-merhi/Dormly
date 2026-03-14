import mongoose from "mongoose";


const connectDB = async () => {
    try {
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongo db connected successfully"); 
        
    } catch (error) {
        console.log("Mongo db connection failed", error);
        process.exit(1); 
    }
}

export default connectDB;