const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middlewares/middleware');
const orderController = require('../controllers/orderController');

router.post('/create', verifyToken, orderController.createFromCart);
router.get('/mine', verifyToken, orderController.getMyOrders);
router.put('/:orderId/status', verifyToken, verifyAdmin, orderController.updateStatus);
router.post('/manual', verifyToken, verifyAdmin, orderController.createManual);
router.get('/all', verifyToken, verifyAdmin, orderController.listAll);

module.exports = router;


