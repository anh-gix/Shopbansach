const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/middleware');
const cartController = require('../controllers/cartController');

router.get('/', verifyToken, cartController.getCart);
router.post('/add', verifyToken, cartController.addItem);
router.put('/update', verifyToken, cartController.updateItem);
router.post('/clear', verifyToken, cartController.clearCart);

module.exports = router;


