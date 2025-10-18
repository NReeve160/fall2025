const Adventurer = require('../models/adventurer');

// GET all adventurers
const getAllAdventurers = async (req, res) => {
  try {
    const adventurers = await Adventurer.find();
    res.status(200).json(adventurers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching adventurers', error });
  }
};

// POST new adventurer
const createAdventurer = async (req, res) => {
  try {
    const adventurer = new Adventurer(req.body);
    await adventurer.save();
    res.status(201).json(adventurer);
  } catch (error) {
    res.status(400).json({ message: 'Error creating adventurer', error });
  }
};

module.exports = { getAllAdventurers, createAdventurer };
