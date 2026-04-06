import express from 'express';
import dotenv from 'dotenv';
import connectDB from './database/db.js';
import userRoute from './routes/user.routes.js';
import propertyRoute from './routes/property.routes.js';
import adminRoute from './routes/admin.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { OpenAI } from 'openai/client.js';
import messageRouter from './routes/message.routes.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

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
app.use('/api/messages', messageRouter);

// new gemeni ai use
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/aichat', async (req, res) => {
  try {
    const { message } = req.body;
    
    // Use Gemini 2.5 Flash for the free tier
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    // System instruction to give the bot context about Dormly and Lebanon
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "You are Dormly AI, an assistant for a Lebanese student housing platform. Help students find dorms in Beirut, Hamra, and Bekaa. The website contains many dorms with all necessary details for each dorm" }],
        },
        {
          role: "model",
          parts: [{ text: "Understood. I am ready to help students with their housing queries in Lebanon. Tell them also to browse the available dorms on our platform." }],
        },
      ],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    
    res.json({ message: response.text() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "AI is resting. Try again in a bit!" });
  }
});



// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok', timestamp: new Date() }));

app.listen(PORT, () => {
    connectDB();
    console.log(`Server running on port ${PORT}`);
});

