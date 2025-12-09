const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/appointmentController');
const { verifyToken, requireRole } = require('../middlewares/auth');

// Create appointment (desk, patient, admin)
router.post('/', verifyToken, ctrl.createAppointment);

// Update appointment (doctor/admin)
router.put('/:id', verifyToken, ctrl.updateAppointment);

// Get one
router.get('/:id', verifyToken, ctrl.getAppointment);

// List (query params)
router.get('/', verifyToken, ctrl.listAppointments);

// Delete
router.delete('/:id', verifyToken, requireRole('admin','desk'), ctrl.deleteAppointment);

module.exports = router;
