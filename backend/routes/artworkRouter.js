import express from 'express';
import { 
    findAllArtworks,
    findByOwnerID,
    findByArtworkID,
    createArtwork,
    deleteArtwork,
    updateArtwork,
    voteArtwork
} from '../controllers/artworkController.js';
import { verifyToken } from '../middleware/auth.js'; // optional, for protected routes

const router = express.Router();

// Public route: get all artworks
router.get('/all', findAllArtworks);

// Protected routes (require token) example
router.post('/owner', verifyToken, findByOwnerID);
router.post('/find', verifyToken, findByArtworkID);
router.post('/create', verifyToken, createArtwork);
router.put('/update', verifyToken, updateArtwork);
router.delete('/delete', verifyToken, deleteArtwork);
router.post('/vote', verifyToken, voteArtwork);

export default router;
