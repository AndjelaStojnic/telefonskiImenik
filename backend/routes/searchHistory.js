const searchHistoryRoutes = require('./searchHistory');

const express = require('express');
const router = express.Router();
const searchHistoryController = require('../controllers/searchHistory');

router.post('/', searchHistoryController.createSearch);
router.get('/:userId', searchHistoryController.getUserSearches);
router.delete('/:id', searchHistoryController.deleteSearch);

module.exports = router;
