import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

//import all routers
import userRouter from './routes/userRouter.js';
import adminRouter from './routes/adminRouter.js';
import reportRouter from './routes/reportRouter.js';
import artworkRouter from './routes/artworkRouter.js';
import challengeRouter from './routes/challengeRouter.js';
import voteRouter from './routes/voteRouter.js';
import dashboardRouter from './routes/dashboardRouter.js';
import leaderboardRouter from './routes/leaderboardRouter.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

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
app.use('/api/dashboard', dashboardRouter);
app.use('/api/leaderboard', leaderboardRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
