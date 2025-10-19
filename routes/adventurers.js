const express = require('express');
const Adventurer = require('../models/adventurer');
const router = express.Router();

// #swagger.tags = ['Adventurers']
// #swagger.description = 'Get all adventurers'
router.get('/', async (req, res) => {
  try {
    const adventurers = await Adventurer.find();
    res.json(adventurers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// #swagger.tags = ['Adventurers']
// #swagger.description = 'Get an adventurer by ID'
router.get('/:id', async (req, res) => {
  try {
    const adventurer = await Adventurer.findById(req.params.id);
    if (!adventurer) return res.status(404).json({ message: 'Not found' });
    res.json(adventurer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// #swagger.tags = ['Adventurers']
// #swagger.description = 'Create a new adventurer'
router.post('/', async (req, res) => {
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Adventurer info to create',
        required: true,
        schema: { $ref: '#/definitions/Adventurer' }
      } */
  try {
    const adventurer = new Adventurer({
      name: req.body.name,
      class: req.body.class,
      level: req.body.level,
      race: req.body.race,
      background: req.body.background,
      alignment: req.body.alignment,
      hitPoints: req.body.hitPoints
    });

    const newAdventurer = await adventurer.save();
    res.status(201).json(newAdventurer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// #swagger.tags = ['Adventurers']
// #swagger.description = 'Update an adventurer'
router.put('/:id', async (req, res) => {
  try {
    const updated = await Adventurer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// #swagger.tags = ['Adventurers']
// #swagger.description = 'Delete an adventurer'
router.delete('/:id', async (req, res) => {
  try {
    await Adventurer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Adventurer deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
