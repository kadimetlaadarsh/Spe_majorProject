const Patient = require('../models/Patient');

exports.createPatient = async (req, res) => {
  try {
    const payload = req.body;
    // optionally attach createdBy from req.user.id if present
    if (req.user && req.user.id) payload.createdBy = req.user.id;
    const patient = new Patient(payload);
    await patient.save();
    res.status(201).json(patient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPatientById = async (req, res) => {
  try {
    const p = await Patient.findById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Not found' });
    res.json(p);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.searchPatients = async (req, res) => {
  try {
    const q = req.query.q || '';
    const patients = await Patient.find({
      $or: [
        { firstName: new RegExp(q, 'i') },
        { lastName: new RegExp(q, 'i') },
        { 'contact.phone': new RegExp(q, 'i') },
        { 'contact.email': new RegExp(q, 'i') }
      ]
    }).limit(50);
    res.json(patients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updatePatient = async (req, res) => {
  try {
    const updated = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deletePatient = async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.json({ message: 'deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
