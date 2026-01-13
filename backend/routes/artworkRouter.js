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
import cloudinary from 'cloudinary';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

// Public route: get all artworks
router.get('/all', findAllArtworks);

// Protected routes (require token) example
router.post('/upload', verifyToken, upload.single('file'), async (req, res) => {
  try {
    const result = await cloudinary.v2.uploader.upload_stream(
      { folder: 'sharedspace' },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ message: 'Upload failed' });
        }
        res.json({ imageURL: result.secure_url });
      }
    );
    result.end(req.file.buffer);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed' });
  }
});
router.get('/my', verifyToken, findMyArtworks);
router.get('/:id', verifyToken, findByArtworkID);
router.post('/owner', verifyToken, findByOwnerID);
router.post('/create/', verifyToken, createArtwork);
router.put('/update/:id', verifyToken, updateArtwork);
router.delete('/delete/:id', verifyToken, deleteArtwork);

export default router;
