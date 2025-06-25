const { SearchHistory } = require('../models');

// Dodavanje nove pretrage
exports.createSearch = async (req, res) => {
  try {
    const search = await SearchHistory.create(req.body);
    res.status(201).json(search);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Dohvatanje svih pretraga za korisnika
exports.getUserSearches = async (req, res) => {
  try {
    const searches = await SearchHistory.findAll({
      where: { userId: req.params.userId },
      order: [['createdAt', 'DESC']],
    });
    res.json(searches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Brisanje pretrage po ID
exports.deleteSearch = async (req, res) => {
  try {
    const deleted = await SearchHistory.destroy({ where: { id: req.params.id } });
    if (deleted) return res.json({ message: 'Search deleted' });
    res.status(404).json({ error: 'Search not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
