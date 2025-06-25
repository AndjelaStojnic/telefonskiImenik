const { Contact } = require('../models');
const { Op } = require('sequelize');

// Dodavanje kontakta
exports.createContact = async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json(contact);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Dohvatanje svih kontakata (po abecedi)
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.findAll({ order: [['ime', 'ASC']] });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Dohvatanje kontakta po ID-u
exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id);
    if (!contact) return res.status(404).json({ error: 'Kontakt nije pronađen' });
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Ažuriranje kontakta
exports.updateContact = async (req, res) => {
  try {
    const [updated] = await Contact.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedContact = await Contact.findByPk(req.params.id);
      return res.json(updatedContact);
    }
    res.status(404).json({ error: 'Kontakt nije pronađen' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Brisanje kontakta
exports.deleteContact = async (req, res) => {
  try {
    const deleted = await Contact.destroy({ where: { id: req.params.id } });
    if (deleted) return res.json({ message: 'Kontakt je obrisan' });
    res.status(404).json({ error: 'Kontakt nije pronađen' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Pretraga kontakata po imenu ili prezimenu
exports.searchContacts = async (req, res) => {
  try {
    const term = req.query.q;
    const results = await Contact.findAll({
      where: {
        [Op.or]: [
          { ime: { [Op.iLike]: `%${term}%` } },
          { prezime: { [Op.iLike]: `%${term}%` } }
        ]
      },
      order: [['ime', 'ASC']]
    });
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obeleži kontakt kao omiljeni
exports.markFavorite = async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id);
    if (!contact) return res.status(404).json({ error: 'Kontakt nije pronađen' });

    contact.omiljeni = true;
    await contact.save();

    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Ukloni iz omiljenih
exports.unmarkFavorite = async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id);
    if (!contact) return res.status(404).json({ error: 'Kontakt nije pronađen' });

    contact.omiljeni = false;
    await contact.save();

    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Dohvati omiljene kontakte za određenog korisnika
exports.getFavorites = async (req, res) => {
  try {
    const userId = req.params.userId;
    const favorites = await Contact.findAll({
      where: {
        userId,
        omiljeni: true
      },
      order: [['ime', 'ASC']]
    });
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getContactsByUserId = async (req, res) => {
  try {
    const contacts = await Contact.findAll({
      where: { userId: req.params.userId },
      order: [['ime', 'ASC']]
    });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
