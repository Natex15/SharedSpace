import express from 'express';
import { registerUser, loginUser, getRegisteredUsers, 
    sendFriendRequest, acceptFriendRequest, declineFriendRequest, 
    removeFriend, getFriendsList, getPendingRequests,
    findByUserEmail, deleteUser, updateUser, findCurrentUser 
} from '../controllers/userController.js'; 
import { isAdmin, verifyToken } from '../middleware/auth.js'; 

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/all', verifyToken, getRegisteredUsers);

router.get('/me', verifyToken, findCurrentUser);
router.put('/update', verifyToken, updateUser);
router.post('/find', verifyToken, findByUserEmail);
router.delete('/delete', verifyToken, isAdmin, deleteUser);

router.post('/friends/request', verifyToken, sendFriendRequest);
router.post('/friends/accept', verifyToken, acceptFriendRequest);
router.post('/friends/decline', verifyToken, declineFriendRequest);
router.delete('/friends/remove', verifyToken, removeFriend);
router.get('/friends', verifyToken, getFriendsList);
router.get('/friends/pending', verifyToken, getPendingRequests);

export default router;
