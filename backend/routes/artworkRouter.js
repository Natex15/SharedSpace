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
router.get('/:id', verifyToken, findByArtworkID);
router.post('/owner', verifyToken, findByOwnerID);
router.post('/create/', verifyToken, createArtwork);
router.put('/update/:id', verifyToken, updateArtwork);
router.delete('/delete/:id', verifyToken, deleteArtwork);

export default router;
