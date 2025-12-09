const mongoose = require('mongoose');

async function connectDB(uri) {
  try {
    if (!uri) {
      throw new Error('MONGO_URI not provided to connectDB');
    }
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Patient DB connected');
  } catch (err) {
    console.error('Patient DB connection error:', err);
    process.exit(1);
  }
}

module.exports = connectDB;