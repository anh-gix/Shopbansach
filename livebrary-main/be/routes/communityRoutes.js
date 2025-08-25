const express = require('express');
const router = express.Router();
const communitiesController = require('../controllers/communitiesController');
const { verifyToken } = require('../middlewares/middleware');
router.post('/createCommunity', verifyToken, communitiesController.createCommunity);
router.get('/getAllCommunity', communitiesController.getCommunities);
router.put('/updateCommunity/:id', verifyToken, communitiesController.updateCommunity);
router.delete('/deleteCommunity/:id', verifyToken, communitiesController.deleteCommunity);
router.get('/:id', communitiesController.getCommunityById);
router.patch('/:id/addMember', verifyToken, communitiesController.addMemberToCommounity);
router.patch('/:id/removeMember', verifyToken, communitiesController.removeMemberFromCommunity);



module.exports = router;