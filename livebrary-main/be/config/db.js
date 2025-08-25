const mongoose = require('mongoose');
require("dotenv").config();




const MONGODB_URI = `mongodb://127.0.0.1:27017/livebrary`;


const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
