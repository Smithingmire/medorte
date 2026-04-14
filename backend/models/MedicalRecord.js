import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  title: { type: String, required: true },
  description: { type: String },
  fileUrl: { type: String, required: true }, 
  recordType: { type: String, enum: ['Prescription', 'Report', 'Other'], default: 'Report' }
}, { timestamps: true });

const MedicalRecord = mongoose.model('MedicalRecord', recordSchema);
export default MedicalRecord;
