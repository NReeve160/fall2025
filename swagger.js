const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Adventurer’s Guild API',
    description: 'API for managing D&D adventurers',
    version: '1.0.0',
  },
  host: 'localhost:8080',
  schemes: ['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./index.js']; // You can add other route files here if needed

swaggerAutogen(outputFile, endpointsFiles, doc);
