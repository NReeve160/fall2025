const express = require('express');
const router = express.Router();
const { getAllAdventurers, createAdventurer } = require('../controllers/adventurersController');

// GET all adventurers
router.get('/', getAllAdventurers);

// POST new adventurer
router.post('/', createAdventurer);

module.exports = router;
