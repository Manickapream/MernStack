const mongoose = require('mongoose');

const connectDB = async () => {
  const maxRetries = 5;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 15000,
        socketTimeoutMS: 45000,
      });
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return; // success — exit loop
    } catch (error) {
      attempt++;
      console.error(`❌ MongoDB Connection Error (attempt ${attempt}/${maxRetries}): ${error.message}`);

      if (error.message.includes('IP') || error.message.includes('whitelist') || error.message.includes('Atlas')) {
        console.error('👉 Fix: Go to MongoDB Atlas → Network Access → Add your current IP (or 0.0.0.0/0 for dev)');
      }

      if (attempt < maxRetries) {
        const delay = attempt * 3000; // 3s, 6s, 9s ...
        console.log(`⏳ Retrying in ${delay / 1000}s...`);
        await new Promise((res) => setTimeout(res, delay));
      } else {
        console.error('🚨 Could not connect to MongoDB after multiple attempts. Server will NOT start.');
        process.exit(1);
      }
    }
  }
};

module.exports = connectDB;
