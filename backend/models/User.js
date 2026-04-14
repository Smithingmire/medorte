import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, enum: ['Patient', 'Doctor', 'Admin'], required: true },
  isEmailVerified: { type: Boolean, default: false },
  
  specialization: { type: String },
  licenseNumber: { type: String },
  clinicAddress: { type: String },
  degreeCertificateUrl: { type: String }, 
  status: { type: String, enum: ['Unverified', 'Verified', 'Rejected'], default: 'Unverified' },
  clinicStartTime: { type: String, default: '09:00' },
  clinicEndTime: { type: String, default: '17:00' },
  lunchStartTime: { type: String, default: '13:00' },
  lunchEndTime: { type: String, default: '14:00' },
  
  location: {
    type: { type: String, enum: ['Point'], required: false },
    coordinates: { type: [Number], required: false },
  }
}, { timestamps: true });

userSchema.index({ location: '2dsphere' });

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
