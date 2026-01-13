import express from 'express';
import { registerUser, loginUser, getRegisteredUsers, 
    sendFriendRequest, acceptFriendRequest, declineFriendRequest, 
    removeFriend, getFriendsList, getPendingRequests,
    findByUserEmail, findByUsername, deleteUser, updateUser, findCurrentUser,
    getOutgoingRequests, cancelOutgoingRequest, streakCheckIn
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
router.post('/findByUsername', verifyToken, findByUsername);
router.delete('/delete', verifyToken, isAdmin, deleteUser);

router.post('/friends/request', verifyToken, sendFriendRequest);
router.post('/friends/accept', verifyToken, acceptFriendRequest);
router.post('/friends/decline', verifyToken, declineFriendRequest);
router.delete('/friends/remove', verifyToken, removeFriend);
router.delete('/friends/cancel', verifyToken, cancelOutgoingRequest);
router.get('/friends', verifyToken, getFriendsList);
router.get('/friends/pending', verifyToken, getPendingRequests);
router.get('/friends/outgoing', verifyToken, getOutgoingRequests);

export default router;
