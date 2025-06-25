const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact');

// CRUD rute za kontakte
router.post('/', contactController.createContact);
router.get('/', contactController.getAllContacts);
router.get('/:id', contactController.getContactById);
router.put('/:id', contactController.updateContact);
router.delete('/:id', contactController.deleteContact);

// Pretraga kontakata
router.get('/search', contactController.searchContacts);

// Omiljeni kontakti
router.put('/:id/favorite', contactController.markFavorite);
router.put('/:id/unfavorite', contactController.unmarkFavorite);
router.get('/favorites/:userId', contactController.getFavorites);

module.exports = router;
