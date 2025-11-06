import express from 'express';
import {
  createReport,
  getAllReports,
  getReportById,
  updateReportStatus,
  deleteReport
} from '../controllers/reportController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// User routes
router.post('/create', verifyToken, createReport);
router.get('/:id', verifyToken, getReportById);

// Admin routes
router.get('/', verifyToken, isAdmin, getAllReports);
router.put('/:id/status', verifyToken, isAdmin, updateReportStatus);
router.delete('/:id', verifyToken, isAdmin, deleteReport);

export default router;
