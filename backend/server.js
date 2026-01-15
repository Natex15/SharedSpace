import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import cloudinary from 'cloudinary';

//import all routers
import userRouter from './routes/userRouter.js';
import adminRouter from './routes/adminRouter.js';
import reportRouter from './routes/reportRouter.js';
import artworkRouter from './routes/artworkRouter.js';
import challengeRouter from './routes/challengeRouter.js';
import voteRouter from './routes/voteRouter.js';
import notificationRouter from './routes/notificationRouter.js'
// import dashboardRouter from './routes/dashboardRouter.js';
import leaderboardRouter from './routes/leaderboardRouter.js';

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
app.use(express.json());

// 1. Allow 'OPTIONS' method explicitly
// 2. Use origin: true (This tells CORS to reflect the request origin)
const corsOptions = {
  origin: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Added OPTIONS
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight

//connect mongodb
// This ensures it works whether you use MONGO_URI (code) or MONGODB_URI (README)
const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI;
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('SharedSpace API is running...');
});

//routes
app.use('/api/users', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/artworks', artworkRouter);
app.use('/api/reports', reportRouter);
app.use('/api/challenges', challengeRouter);
app.use('/api/votes', voteRouter);
// app.use('/api/dashboard', dashboardRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/leaderboard', leaderboardRouter);

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
}

export default app;
