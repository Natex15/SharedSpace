import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import isAdmin from '../middleware/isAdmin.js';

const router = express.Router();

// Example protected admin route
router.get('/dashboard', verifyToken, isAdmin, (req, res) => {
    res.json({ message: "Welcome, Admin!" });
});

export default router;
