const { UserProfile } = require('../models');

// Kreiranje profila korisnika
exports.createUserProfile = async (req, res) => {
  try {
    const profile = await UserProfile.create(req.body);
    res.status(201).json(profile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Dohvatanje profila po userId
exports.getUserProfile = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ where: { userId: req.params.userId } });
    if (!profile) return res.status(404).json({ error: 'Profil nije pronađen' });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Ažuriranje profila po userId
exports.updateUserProfile = async (req, res) => {
  try {
    const [updated] = await UserProfile.update(req.body, {
      where: { userId: req.params.userId }
    });
    if (updated) {
      const updatedProfile = await UserProfile.findOne({ where: { userId: req.params.userId } });
      return res.json(updatedProfile);
    }
    res.status(404).json({ error: 'Profil nije pronađen' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Brisanje profila po userId (ako treba)
exports.deleteUserProfile = async (req, res) => {
  try {
    const deleted = await UserProfile.destroy({ where: { userId: req.params.userId } });
    if (deleted) return res.json({ message: 'Profil obrisan' });
    res.status(404).json({ error: 'Profil nije pronađen' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
