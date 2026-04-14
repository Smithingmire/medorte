import express from 'express';
import { getUsers, getUnverifiedDoctors, verifyDoctor, getStats } from '../controllers/adminController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/users', protect, admin, getUsers);
router.get('/doctors/unverified', protect, admin, getUnverifiedDoctors);
router.put('/doctors/:id/verify', protect, admin, verifyDoctor);
router.get('/stats', protect, admin, getStats);

export default router;
