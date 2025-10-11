// swagger.js
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'My API',
    description: 'API documentation for my Express project',
  },
  host: 'localhost:8080', // change if your server runs on a different port
  schemes: ['http'],
};

const outputFile = './swagger-output.json'; // generated file
const endpointsFiles = ['./index.js']; // your main server file with routes

swaggerAutogen(outputFile, endpointsFiles, doc);
