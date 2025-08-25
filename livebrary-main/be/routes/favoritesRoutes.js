const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favoritesController');
const { verifyToken } = require('../middlewares/middleware');


router.post('/addToFavorite',verifyToken, favoritesController.addToFavorites);
router.get('/user/:userId',verifyToken, favoritesController.getFavoritesByUser);
router.delete('/:userId/:bookId',verifyToken, favoritesController.deleteFavorite);

module.exports = router;
