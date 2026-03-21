import express from 'express';
import dotenv from 'dotenv';
import connectDB from './database/db.js';
import userRoute from './routes/user.routes.js';
import propertyRoute from './routes/property.routes.js';
import adminRoute from './routes/admin.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.urlencoded({ extended: true }));
//new added to give access to the upload folder 
app.use("/uploads", express.static("uploads"));

app.use('/api/user', userRoute);
app.use('/api/properties', propertyRoute);
app.use('/api/admin', adminRoute);

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok', timestamp: new Date() }));

app.listen(PORT, () => {
    connectDB();
    console.log(`Server running on port ${PORT}`);
});
