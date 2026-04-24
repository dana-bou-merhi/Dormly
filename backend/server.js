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
import { Property } from './models/property.model.js';

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
/*
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
*/


app.post('/api/aichat', async (req, res) => {
  try {
    const { message } = req.body;

    // Fetch  properties from MongoDB
    const properties = await Property.find({   status: { $in: ['Available Now', 'Coming Soon'] } })
    .select('title type price priceUnit location distance status availability availableFrom furnishing description rating reviews dormlyScore amenities amenityLabels nearbyAmenities landlord.verified')
    .limit(30)
    .lean();

    //  Format properties into readable context for the AI
    const formattedProperties = properties.map(p => ({
      title: p.title,
      type: p.type,
      price: `$${p.price}/${p.priceUnit}`,
      location: p.location,
      distance: p.distance,
      status: p.status,
      availableFrom: p.availableFrom || p.availableDate || 'Now',
      furnishing: p.furnishing,
      rating: p.rating ? `${p.rating}/5 (${p.reviews} reviews)` : 'No reviews yet',
      dormlyScore: p.dormlyScore ? `${p.dormlyScore}/10` : null,
      amenities: p.amenities?.slice(0, 6),         // keep context lean
      nearbyAmenities: p.nearbyAmenities?.slice(0, 4),
      verifiedLandlord: p.landlord?.verified,
    }));

    const dormContext = formattedProperties.length > 0
      ? `Here are the currently available properties on Dormly:\n${JSON.stringify(formattedProperties, null, 2)}`
      : `No properties are currently available on the platform.`;

   
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ 
            text: `You are Dormly AI, a helpful assistant for a Lebanese student housing platform.
You help students find dorms and apartments in Beirut, Hamra, Bekaa and nearby areas.
Always recommend specific listings from the data below when relevant.
If a student asks about price, location, amenities, or availability — use the real data.
If no listing matches perfectly, suggest the closest options and explain why.

${dormContext}`
          }],
        },
        {
          role: "model",
          parts: [{ text: "Understood. I have the current Dormly listings loaded and I'm ready to help students find the best housing in Lebanon based on real availability, prices, and amenities." }],
        },
      ],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;

    res.json({ message: response.text() });

  } catch (error) {
    console.error(error);

    if (error.name === 'MongoNetworkError' || error.name === 'MongoServerSelectionError') {
      return res.status(500).json({ message: "Database connection error. Please try again." });
    }

    res.status(500).json({ message: "AI is resting. Try again in a bit!" });
  }
});


// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok', timestamp: new Date() }));

app.listen(PORT, () => {
    connectDB();
    console.log(`Server running on port ${PORT}`);
});

