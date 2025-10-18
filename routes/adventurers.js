const express = require('express');
const router = express.Router();

// #swagger.tags = ['Adventurers']
// #swagger.description = 'Get all adventurers'
router.get('/', (req, res) => {
  res.json([{ name: 'Lirael', class: 'Rogue', level: 5 }]);
});

// #swagger.tags = ['Adventurers']
// #swagger.description = 'Get an adventurer by ID'
// #swagger.parameters['id'] = { description: 'Adventurer ID', type: 'string' }
router.get('/:id', (req, res) => {
  res.json({ name: 'Lirael', class: 'Rogue', level: 5 });
});

// #swagger.tags = ['Adventurers']
// #swagger.description = 'Create a new adventurer'
router.post('/', (req, res) => {
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Adventurer info to create',
        required: true,
        schema: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Lirael' },
            class: { type: 'string', example: 'Rogue' },
            level: { type: 'integer', example: 5 }
          }
        }
      } */
  res.status(201).json({ message: 'Adventurer created', data: req.body });
});

// #swagger.tags = ['Adventurers']
router.put('/:id', (req, res) => {
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Updated adventurer info',
        required: true,
        schema: {
          $ref: '#/definitions/Adventurer'
        }
      } */
  res.json({ message: 'Adventurer updated', data: req.body });
});

// #swagger.tags = ['Adventurers']
router.delete('/:id', (req, res) => {
  res.json({ message: 'Adventurer deleted' });
});

module.exports = router;
