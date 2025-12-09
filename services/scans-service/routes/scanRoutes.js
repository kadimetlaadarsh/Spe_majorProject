const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/scanController');
const { verifyToken /* , requireRole */ } = require('../middlewares/auth');
const { upload } = require('../middlewares/upload');

// Upload a scan
router.post(
  '/',
  verifyToken,
  upload.single('file'),  // field name: 'file'
  ctrl.uploadScan
);

// List scans for a patient
router.get(
  '/patient/:patientId',
  verifyToken,
  ctrl.getScansByPatient
);

// Get scan metadata
router.get(
  '/:id',
  verifyToken,
  ctrl.getScanMeta
);

// Stream/view scan
router.get(
  '/:id/stream',
  verifyToken,
  ctrl.streamScan
);

// Download scan
router.get(
  '/:id/download',
  verifyToken,
  ctrl.downloadScan
);

// Delete scan
router.delete(
  '/:id',
  verifyToken,
  // requireRole('admin', 'doctor'),
  ctrl.deleteScan
);

module.exports = router;
