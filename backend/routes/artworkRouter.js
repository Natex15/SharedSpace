import express from 'express';
import {
    findAllArtworks,
    findByOwnerID,
    findMyArtworks,
    findByArtworkID,
    createArtwork,
    deleteArtwork,
    updateArtwork
} from '../controllers/artworkController.js';
import { verifyToken } from '../middleware/auth.js'; // for protected routes
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

const router = express.Router();

// Public route: get all artworks
router.get('/all', findAllArtworks);

// Protected routes (require token) example
router.post('/upload', verifyToken, upload.single('file'), (req, res) => {
  res.json({ imageURL: `http://localhost:3000/uploads/${req.file.filename}` });
});
router.get('/my', verifyToken, findMyArtworks);
router.get('/:id', verifyToken, findByArtworkID);
router.post('/owner', verifyToken, findByOwnerID);
router.post('/create/', verifyToken, createArtwork);
router.put('/update/:id', verifyToken, updateArtwork);
router.delete('/delete/:id', verifyToken, deleteArtwork);

export default router;
