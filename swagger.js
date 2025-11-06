// swagger.js
import swaggerAutogen from 'swagger-autogen';

const doc = {
  openapi: '3.0.3',
  info: {
    title: 'Adventurers Guild API',
    description: 'API documentation for Adventurers Guild'
  },
  servers: [
    { url: 'http://localhost:8080' }
  ]
};

const outputFile = './swagger.json';       // ✅ output file
const endpointsFiles = ['./index.js'];     // ✅ scans routes automatically

swaggerAutogen()(outputFile, endpointsFiles, doc);
