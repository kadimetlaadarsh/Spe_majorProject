const mongoose = require('mongoose');

async function connectDB(uri) {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Scans DB connected');
  } catch (err) {
    console.error('Scans DB connection error:', err);
    process.exit(1);
  }
}

module.exports = connectDB;
