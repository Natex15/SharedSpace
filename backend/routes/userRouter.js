import express from 'express';
import {
    registerUser, loginUser, getRegisteredUsers, getUserById,
    sendFriendRequest, acceptFriendRequest, declineFriendRequest, removeFriend,
    getFriendsList, getPendingRequests, findByUserEmail, findByUsername,
    deleteUser, updateUser, findCurrentUser, getOutgoingRequests,
    cancelOutgoingRequest, streakCheckIn, getUserAchievements, getStreak,
    deleteCurrentUserAccount, banUser
} from '../controllers/userController.js';
import { isAdmin, verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/all', verifyToken, isAdmin, getRegisteredUsers);

router.get('/me', verifyToken, findCurrentUser);
router.put('/update', verifyToken, updateUser);
router.post('/find', verifyToken, findByUserEmail);
router.put('/streak', verifyToken, streakCheckIn);
router.get('/get-streak', verifyToken, getStreak);
router.post('/findByUsername', verifyToken, findByUsername);
router.delete('/delete', verifyToken, deleteUser);

router.post('/friends/request', verifyToken, sendFriendRequest);
router.post('/friends/accept', verifyToken, acceptFriendRequest);
router.post('/friends/decline', verifyToken, declineFriendRequest);
router.delete('/friends/remove', verifyToken, removeFriend);
router.delete('/friends/cancel', verifyToken, cancelOutgoingRequest);
router.get('/friends', verifyToken, getFriendsList);
router.get('/friends/pending', verifyToken, getPendingRequests);
router.get('/friends/outgoing', verifyToken, getOutgoingRequests);
router.put('/ban/:id', verifyToken, isAdmin, banUser);

router.get('/:id', verifyToken, getUserById);
router.get('/:id/achievements', verifyToken, getUserAchievements);

export default router;