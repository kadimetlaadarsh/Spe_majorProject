const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, required: true },
  scheduledAt: { type: Date, required: true },
  durationMinutes: { type: Number, default: 30 },
  status: { type: String, enum: ['scheduled','checked-in','completed','cancelled','no-show'], default: 'scheduled' },
  reason: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId }, // who created the appointment
  queuePosition: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

// Index to speed up conflict checks
AppointmentSchema.index({ doctorId: 1, scheduledAt: 1 });

module.exports = mongoose.model('Appointment', AppointmentSchema);
