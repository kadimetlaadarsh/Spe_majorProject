const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/billingController');
const { verifyToken, requireRole } = require('../middlewares/auth');

// Create bill
router.post('/', verifyToken, requireRole('admin','desk','doctor'), ctrl.createBill);

// Get bill
router.get('/:id', verifyToken, ctrl.getBill);

// List
router.get('/', verifyToken, ctrl.listBills);

// Add item
router.post('/:id/items', verifyToken, requireRole('admin','desk'), ctrl.addItem);

// Pay
router.post('/:id/pay', verifyToken, requireRole('admin','desk','patient'), ctrl.payBill);

// Cancel
router.post('/:id/cancel', verifyToken, requireRole('admin','desk'), ctrl.cancelBill);

module.exports = router;
