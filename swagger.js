// swagger.js (CommonJS)
const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' }); // <-- force OAS3

const doc = {
  info: { title: 'Adventurers Guild API', version: '1.0.0' },
  // OAS3 uses "servers" (do NOT include host/basePath/schemes)
  servers: [
    { url: 'https://fall2025.onrender.com' },   // put Render FIRST so it’s default
    { url: 'http://localhost:8080' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
    }
  },
  security: [{ bearerAuth: [] }]
};

const outputFile = './swagger.json';
const endpointsFiles = ['./index.js'];
swaggerAutogen(outputFile, endpointsFiles, doc);
