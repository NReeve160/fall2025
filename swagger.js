// swagger.js
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'My API',
    description: 'API documentation for my Express project',
  },
  host: process.env.SWAGGER_HOST || 'localhost:8080',
  schemes: ['http'],
};

const outputFile = './swagger-output.json'; // generated file
const endpointsFiles = ['./index.js']; // your main server file with routes

swaggerAutogen(outputFile, endpointsFiles, doc);
