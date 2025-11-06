import express from 'express';
import { registerUser, loginUser, getRegisteredUsers } from '../controllers/userController.js'; 
import { verifyToken } from '../middleware/auth.js'; 

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/all', verifyToken, getRegisteredUsers);

export default router;
