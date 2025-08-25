const express = require('express');
const router = express.Router();


const reviewsController = require('../controllers/reviewsController');
const { verifyToken } = require('../middlewares/middleware');

router.post('/addReview',verifyToken, reviewsController.addReview);
router.get('/:bookId', reviewsController.getReviewsByBook);
module.exports = router;