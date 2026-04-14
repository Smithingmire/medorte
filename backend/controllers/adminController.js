import User from '../models/User.js';
import Appointment from '../models/Appointment.js';

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getUnverifiedDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'Doctor', status: 'Unverified' }).select('-password');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const verifyDoctor = async (req, res) => {
  const { status } = req.body; 
  try {
    const doctor = await User.findById(req.params.id);

    if (doctor && doctor.role === 'Doctor') {
      doctor.status = status;
      const updatedDoctor = await doctor.save();
      res.json(updatedDoctor);
    } else {
      res.status(404).json({ message: 'Doctor not found' });
    }
  } catch (error) {
    console.error('Verify Doctor Error:', error);
    res.status(500).json({ message: error.message });
  }
};


export const getStats = async (req, res) => {
  try {
    const patientsCount = await User.countDocuments({ role: 'Patient' });
    const doctorsCount = await User.countDocuments({ role: 'Doctor' });
    const appointmentsCount = await Appointment.countDocuments();
    
    res.json({ patients: patientsCount, doctors: doctorsCount, appointments: appointmentsCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
