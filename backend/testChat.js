import mongoose from 'mongoose';
import Message from './models/Message.js';
import dotenv from 'dotenv';
dotenv.config();

(async () => {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/medorte');
    const messages = await Message.find({});
    console.log('Total messages in DB:', messages.length);
    if (messages.length > 0) {
        console.log('Sample message:', messages[0]);
    }
    process.exit(0);
})();
