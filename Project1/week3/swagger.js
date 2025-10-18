// swagger.js
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Temple API',
    description: 'API documentation for the Temple project',
    version: '1.0.0',
  },
  host: 'localhost:8080',
  schemes: ['http'],

  // Add definitions for your models (Temple, etc.)
  definitions: {
    Temple: {
      name: "Temple Name",
      location: "City, State",
      established: "1900",
      description: "A brief description of the temple"
    },
    // You can add more models here if needed
  },
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./index.js']; // your main routes file

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger documentation generated!');
});
