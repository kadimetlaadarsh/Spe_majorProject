const mongoose = require('mongoose');

async function connectDB(uri) {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Auth DB connected');
  } catch (err) {
    console.error('Auth DB connection error:', err);
    process.exit(1);
  }
}

module.exports = connectDB;
