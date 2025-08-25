// Sales statistics routes
const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');

// GET /api/sales/stats
router.get('/stats', salesController.getSalesStats);

module.exports = router;
