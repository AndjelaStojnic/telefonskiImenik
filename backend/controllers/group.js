const { Group } = require('../models');

// Kreiranje nove grupe
exports.createGroup = async (req, res) => {
  try {
    const group = await Group.create(req.body);
    res.status(201).json(group);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Dohvatanje svih grupa
exports.getAllGroups = async (req, res) => {
  try {
    const groups = await Group.findAll();
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Dohvatanje grupe po ID
exports.getGroupById = async (req, res) => {
  try {
    const group = await Group.findByPk(req.params.id);
    if (!group) return res.status(404).json({ error: 'Group not found' });
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Izmena grupe po ID
exports.updateGroup = async (req, res) => {
  try {
    const [updated] = await Group.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedGroup = await Group.findByPk(req.params.id);
      return res.json(updatedGroup);
    }
    res.status(404).json({ error: 'Group not found' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Brisanje grupe po ID
exports.deleteGroup = async (req, res) => {
  try {
    const deleted = await Group.destroy({
      where: { id: req.params.id }
    });
    if (deleted) return res.json({ message: 'Group deleted' });
    res.status(404).json({ error: 'Group not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
