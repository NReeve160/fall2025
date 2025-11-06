// swagger.cjs
const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' }); // force OAS3

const doc = {
  openapi: '3.0.3',
  info: { title: 'Adventurers Guild API', version: '1.0.0' },
  // OAS3: use ONLY "servers" (no host/basePath/schemes)
  servers: [
    { url: 'https://fall2025.onrender.com' },
    { url: 'http://localhost:8080' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
    }
  },
  security: [{ bearerAuth: [] }],
  // (optional) tags, schemas, etc.
};

const outputFile = './swagger.json';      // MUST match what index.js reads
const endpointsFiles = ['./index.js'];    // entry that mounts your routes

swaggerAutogen(outputFile, endpointsFiles, doc);
