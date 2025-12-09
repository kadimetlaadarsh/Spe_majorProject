const mongoose = require('mongoose');

const ScanMetaSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId, // user id from auth-service
    required: true
  },
  type: {
    type: String, // e.g. 'xray', 'mri', 'ct', 'lab-report'
  },
  description: {
    type: String
  },
  originalName: {
    type: String,
    required: true
  },
  storedName: {
    type: String,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  storagePath: {
    type: String,
    required: true
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ScanMeta', ScanMetaSchema);
