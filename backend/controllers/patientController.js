import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import MedicalRecord from '../models/MedicalRecord.js';
import Prescription from '../models/Prescription.js';


export const searchDoctors = async (req, res) => {
  const { specialization, lng, lat, radiusInKm } = req.query;

  try {
    let query = { role: 'Doctor', status: 'Verified' };

    if (specialization) {
      query.specialization = new RegExp(specialization, 'i');
    }

    if (lng && lat && radiusInKm) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: parseInt(radiusInKm) * 1000,
        },
      };
    }

    const doctors = await User.find(query).select('-password');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const bookAppointment = async (req, res) => {
  const { doctorId, date, timeSlot, reason } = req.body;

  try {
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date,
      timeSlot,
      status: { $in: ['Pending', 'Accepted'] }
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'Time slot is already booked' });
    }

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      date,
      timeSlot,
      reason,
      status: 'Pending',
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate('doctor', 'name specialization clinicAddress')
      .sort({ date: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getMyRecords = async (req, res) => {
  try {
    const records = await MedicalRecord.find({ patient: req.user._id })
      .populate('uploadedBy', 'name role')
      .sort({ createdAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const uploadRecord = async (req, res) => {
  try {
    const { title, description, fileUrl, recordType } = req.body;
    
    const record = await MedicalRecord.create({
      patient: req.user._id,
      uploadedBy: req.user._id,
      title,
      description,
      fileUrl,
      recordType: recordType || 'Report'
    });
    
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getMyPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.user._id })
      .populate('doctor', 'name specialization')
      .populate('appointment', 'date reason')
      .sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
