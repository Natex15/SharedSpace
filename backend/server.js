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

// Configure CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

//connect mongodb
mongoose.connect(process.env.MONGO_URI)
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
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

export default app;
