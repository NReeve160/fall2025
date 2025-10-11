const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Temple API',
    description: 'API documentation for Temple project',
  },
  host: process.env.SWAGGER_HOST || 'fall2025.onrender.com', // <- dynamic host
  schemes: ['https'], // Render uses https
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger documentation generated!');
});
