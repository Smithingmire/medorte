import express from 'express';
import { getAppointments, updateAppointmentStatus, createPrescription, updateProfile } from '../controllers/doctorController.js';
import { protect, doctor } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/appointments', protect, doctor, getAppointments);
router.put('/appointments/:id', protect, doctor, updateAppointmentStatus);
router.post('/prescriptions', protect, doctor, createPrescription);
router.put('/profile', protect, doctor, updateProfile);

export default router;
