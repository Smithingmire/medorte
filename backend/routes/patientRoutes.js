import express from 'express';
import { searchDoctors, bookAppointment, getMyAppointments, getMyRecords, uploadRecord, getMyPrescriptions } from '../controllers/patientController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/doctors', protect, searchDoctors);
router.post('/appointments', protect, bookAppointment);
router.get('/appointments', protect, getMyAppointments);
router.get('/records', protect, getMyRecords);
router.post('/records', protect, uploadRecord);
router.get('/prescriptions', protect, getMyPrescriptions);

export default router;
