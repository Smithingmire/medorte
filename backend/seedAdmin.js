import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import bcrypt from 'bcrypt';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/medorte');
    console.log('DB connected');

    const adminExists = await User.findOne({ email: 'admin@medorte.com' });
    if (!adminExists) {
      await User.create({
        name: 'System Admin',
        email: 'admin@medorte.com',
        password: 'admin123',
        phone: '0000000000',
        role: 'Admin',
      });
      console.log('Admin user created successfully.');
    } else {
      console.log('Admin already exists.');
    }
    process.exit(0);
  } catch (err) {
    console.error('Failed to create Admin', err);
    process.exit(1);
  }
};

seedAdmin();
