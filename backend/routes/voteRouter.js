import express from 'express';
import { getChallengeEntries, submitVote } from '../controllers/voteController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get entries for a challenge
router.get('/entries/:challengeId', verifyToken, getChallengeEntries);

// Submit a vote for an artwork
router.post('/submit/:artworkId', verifyToken, submitVote);

export default router;
