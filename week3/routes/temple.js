const routes = require('express').Router();
const temples = require('../controllers/temple.js');

/* #swagger.tags = ['Temples']
   #swagger.description = 'Get a list of all temples'
   #swagger.responses[200] = { description: 'List of temples retrieved successfully' }
*/
routes.get('/', temples.findAll);

/* #swagger.tags = ['Temples']
   #swagger.description = 'Get a single temple by ID'
   #swagger.parameters['temple_id'] = { description: 'ID of the temple', type: 'string', required: true }
   #swagger.responses[200] = { description: 'Temple retrieved successfully' }
   #swagger.responses[404] = { description: 'Temple not found' }
*/
routes.get('/:temple_id', temples.findOne);

/* #swagger.tags = ['Temples']
   #swagger.description = 'Create a new temple'
   #swagger.parameters['body'] = { 
       in: 'body', 
       description: 'Temple data', 
       required: true, 
       schema: { $ref: "#/definitions/Temple" } 
   }
   #swagger.responses[201] = { description: 'Temple created successfully' }
   #swagger.responses[400] = { description: 'Invalid input' }
*/
routes.post('/', temples.create);

module.exports = routes;
