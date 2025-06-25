const express = require('express');
const router = express.Router();

const userRoutes = require('./user');
const contactRoutes = require('./contact');
const groupRoutes = require('./group');
const callHistoryRoutes = require('./callHistory');
const userProfileRoutes = require('./userProfile');
const searchHistoryRoutes = require('./searchHistory');
const addressRoutes = require('./address');
const uploadRoutes = require('./upload');


router.use('/users', userRoutes);
router.use('/contacts', contactRoutes);
router.use('/groups', groupRoutes);
router.use('/call-history', callHistoryRoutes);
router.use('/userProfiles', userProfileRoutes);
router.use('/searchHistory', searchHistoryRoutes);
router.use('/addresses', addressRoutes);
router.use('/upload', uploadRoutes);

module.exports = router;
