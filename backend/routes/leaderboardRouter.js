import express from 'express';
import {
    getTopArtworks,
    getTopUsers,
    getArtworkRank
} from '../controllers/leaderboardController.js';

const router = express.Router();

// Public routes
router.get('/artworks', getTopArtworks);
router.get('/users', getTopUsers);

// Get specific artwork rank
router.post('/rank', getArtworkRank);

export default router;
