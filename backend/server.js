import express from 'express';
import dotenv from 'dotenv';
import connectDB from './database/db.js';
import userRoute from './routes/user.routes.js';
import propertyRoute from './routes/property.routes.js'
import cookieParser from 'cookie-parser';
import cors from 'cors'
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
}));
app.use(express.urlencoded({ extended: true })); 

app.use("/api/user",userRoute);
app.use("/api/properties",propertyRoute);

app.listen(PORT, () => {
    connectDB();
  console.log(`Server is running on port ${PORT}`);
});