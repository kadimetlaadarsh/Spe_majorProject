const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/prescriptionController');
const { verifyToken, requireRole } = require('../middlewares/auth');

// Create - only doctor allowed
router.post('/', verifyToken, requireRole('doctor'), ctrl.createPrescription);

// List (admin/doctor/patient can view)
router.get('/', verifyToken, ctrl.listPrescriptions);

// Get
router.get('/:id', verifyToken, ctrl.getPrescription);

// Update (doctor or admin)
router.put('/:id', verifyToken, requireRole('doctor','admin'), ctrl.updatePrescription);

// Mark as issued (doctor)
router.post('/:id/issue', verifyToken, requireRole('doctor'), ctrl.issuePrescription);

// Delete (admin)
router.delete('/:id', verifyToken, requireRole('admin'), ctrl.deletePrescription);

module.exports = router;
