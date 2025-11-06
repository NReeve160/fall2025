// swagger.cjs
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Adventurers Guild API',
    version: '1.0.0',
    description: 'Manage D&D campaigns and their adventurers.'
  },
  servers: [
    { url: 'http://localhost:8080' }
    // Add deployment URL here later
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  tags: [
    { name: 'Adventurers', description: 'Player characters' },
    { name: 'Campaigns', description: 'Game campaigns and players' },
    { name: 'Auth', description: 'Developer login for testing' },
    { name: 'System', description: 'System status & operations' }
  ]
};

const outputFile = './swagger.json';
const endpointsFiles = ['./index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
