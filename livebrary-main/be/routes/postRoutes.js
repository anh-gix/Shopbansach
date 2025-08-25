const express = require("express");
const router = express.Router();
const postsController = require('../controllers/postController');
const { verifyToken } = require('../middlewares/middleware');


router.post('/createPost',verifyToken, postsController.createPost);
router.get('/community/:communityId', postsController.getPostsByCommunity);
router.get('/:id',verifyToken, postsController.getPostById);
router.put('/:id',verifyToken, postsController.updatePost);
router.delete('/:id',verifyToken, postsController.deletePost);

module.exports = router;
