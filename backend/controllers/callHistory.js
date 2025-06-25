const { CallHistory } = require('../models');

exports.create = async (req, res) => {
  try {
    const history = await CallHistory.create(req.body);
    res.status(201).json(history);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const history = await CallHistory.findAll();
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const record = await CallHistory.findByPk(req.params.id);
    if (!record) return res.status(404).json({ error: 'Call record not found' });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await CallHistory.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedRecord = await CallHistory.findByPk(req.params.id);
      return res.json(updatedRecord);
    }
    res.status(404).json({ error: 'Call record not found' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await CallHistory.destroy({ where: { id: req.params.id } });
    if (deleted) return res.json({ message: 'Call record deleted' });
    res.status(404).json({ error: 'Call record not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
