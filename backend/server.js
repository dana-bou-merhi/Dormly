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

// ai use
/*const openai = new OpenAI({
    apiKey:process.env.OPENAI_API_KEY,
})

app.post('/api/aichat', async (req, res) => {
  try {
    const { message } = req.body;

    console.log("Incoming message:", message);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "user", content: message }
      ]
    });

    console.log("Full OpenAI response:", completion);

    const aiResponse = completion.choices?.[0]?.message?.content;

    console.log("Extracted AI response:", aiResponse);

    res.json({ message: aiResponse });

  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ error: "Error processing your request" });
  }
});
*/

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok', timestamp: new Date() }));

app.listen(PORT, () => {
    connectDB();
    console.log(`Server running on port ${PORT}`);
});

