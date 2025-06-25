const express = require('express');
const router = express.Router();
const userProfileController = require('../controllers/userProfile');

router.post('/', userProfileController.createUserProfile);
router.get('/:userId', userProfileController.getUserProfile);
router.put('/:userId', userProfileController.updateUserProfile);
router.delete('/:userId', userProfileController.deleteUserProfile);

module.exports = router;
