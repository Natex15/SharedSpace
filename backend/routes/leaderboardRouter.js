import express from 'express';
import {
    findAllLeaderboard,
    findLeaderboardByUserID,
    findLeaderboardByArtworkID,
    createLeaderboardEntry,
    updateLeaderboardEntry,
    deleteLeaderboardEntry
} from '../controllers/leaderboardController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Public route: get all leaderboard entries
router.get('/all', findAllLeaderboard);

// Protected routes — require token
router.post('/user', verifyToken, findLeaderboardByUserID);
router.post('/artwork', verifyToken, findLeaderboardByArtworkID);
router.post('/create', verifyToken, createLeaderboardEntry);
router.put('/update', verifyToken, updateLeaderboardEntry);
router.delete('/delete', verifyToken, deleteLeaderboardEntry);

export default router;
