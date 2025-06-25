const { Address } = require('../models');

// Kreiranje adrese
exports.createAddress = async (req, res) => {
  try {
    const address = await Address.create(req.body);
    res.status(201).json(address);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Sve adrese
exports.getAllAddresses = async (req, res) => {
  try {
    const addresses = await Address.findAll();
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Jedna adresa po ID
exports.getAddressById = async (req, res) => {
  try {
    const address = await Address.findByPk(req.params.id);
    if (!address) return res.status(404).json({ error: 'Address not found' });
    res.json(address);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Ažuriranje adrese
exports.updateAddress = async (req, res) => {
  try {
    const [updated] = await Address.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedAddress = await Address.findByPk(req.params.id);
      return res.json(updatedAddress);
    }
    res.status(404).json({ error: 'Address not found' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Brisanje adrese
exports.deleteAddress = async (req, res) => {
  try {
    const deleted = await Address.destroy({
      where: { id: req.params.id }
    });
    if (deleted) return res.json({ message: 'Address deleted' });
    res.status(404).json({ error: 'Address not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
