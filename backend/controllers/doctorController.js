import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import Prescription from '../models/Prescription.js';


export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user._id })
      .populate('patient', 'name email phone location')
      .sort({ date: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.doctor.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    appointment.status = status;
    const updatedAppointment = await appointment.save();
    
    
    res.json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const createPrescription = async (req, res) => {
  const { patientId, appointmentId, medicines, notes } = req.body;
  
  try {
    const prescription = await Prescription.create({
      patient: patientId,
      doctor: req.user._id,
      appointment: appointmentId,
      medicines,
      notes,
    });

    res.status(201).json(prescription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const doctor = await User.findById(req.user._id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    
    doctor.clinicStartTime = req.body.clinicStartTime || doctor.clinicStartTime;
    doctor.clinicEndTime = req.body.clinicEndTime || doctor.clinicEndTime;
    doctor.lunchStartTime = req.body.lunchStartTime || doctor.lunchStartTime;
    doctor.lunchEndTime = req.body.lunchEndTime || doctor.lunchEndTime;

    const updatedDoctor = await doctor.save();
    res.json(updatedDoctor);
  } catch(error) {
    res.status(500).json({ message: error.message });
  }
};
