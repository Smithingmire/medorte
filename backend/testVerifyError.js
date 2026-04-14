import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';
dotenv.config();

(async () => {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/medorte');
    const doctor = await User.findOne({role: 'Doctor'});
    if (!doctor) { console.log('No doctor found'); process.exit(0); }
    console.log('Doctor found:', doctor._id);
    doctor.status = 'Verified';
    try {
        await doctor.save();
        console.log('Save successful');
    } catch(err) {
        console.error('Validation Error during save:', err);
    }
    process.exit(0);
})();
