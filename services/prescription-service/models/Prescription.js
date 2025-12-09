const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  medicine: { type: String, required: true },
  strength: String,
  form: String, // tablet/ syrup
  dosage: String, // e.g., "1-0-1"
  durationDays: Number,
  notes: String
});

const PrescriptionSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, required: true },
  date: { type: Date, default: Date.now },
  items: [ItemSchema],
  notes: String,
  issued: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId }
});

module.exports = mongoose.model('Prescription', PrescriptionSchema);
