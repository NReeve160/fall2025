// swagger.js
const swaggerAutogen = require('swagger-autogen')();

// Use environment variable for host, fallback to localhost
const doc = {
  info: {
    title: 'Contacts API',
    description: 'API for Contacts',
    version: '1.0.0',
  },
  schemes: ['http', 'https'], // supports both
  basePath: '/', // optional, if your routes are prefixed add here
  // optional global security, definitions, etc.
};

// Define the endpoints files to scan
const outputFile = './swagger-output.json';
const endpointsFiles = ['./index.js']; // add other route files if needed

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger documentation generated successfully!');
});
