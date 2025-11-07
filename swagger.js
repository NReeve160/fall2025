// swagger.js (CommonJS)
const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' }); // <-- force OAS3

const doc = {
  info: {
    title: 'Adventurer’s Guild API',
    description: 'API for managing D&D adventurers',
    version: '1.0.0',
  },
  host: 'localhost:8080',
  schemes: ['http'],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'Enter JWT token as: Bearer <token>'
    }
  },
  security: [{ bearerAuth: [] }],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./index.js'];
swaggerAutogen(outputFile, endpointsFiles, doc);
