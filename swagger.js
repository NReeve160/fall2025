// swagger.js
import swaggerAutogen from 'swagger-autogen';

const doc = {
  openapi: '3.0.0',
  info: {
    title: 'Adventurers Guild API',
    description: 'API for managing D&D Adventurers and Campaigns',
    version: '1.0.0'
  },
  servers: [
    { url: 'https://fall2025.onrender.com' },
    { url: 'http://localhost:8080' }
  ],
  tags: [
    { name: 'Service health', description: 'Liveness and readiness endpoints' },
    { name: 'Authorization', description: 'Authentication flows and helpers (OAuth + JWT)' },
    { name: 'Campaigns', description: 'Manage campaigns and their members' },
    { name: 'Adventurers', description: 'Create, read, update, and delete adventurers' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      Adventurer: {
        type: 'object',
        required: [
          'name',
          'race',
          'class',
          'level',
          'alignment',
          'background',
          'hitPoints'
        ],
        properties: {
          name: { type: 'string', example: 'Arannis' },
          race: { type: 'string', example: 'Elf' },
          class: { type: 'string', example: 'Ranger' },
          level: { type: 'integer', example: 3, minimum: 1, maximum: 20 },
          alignment: { type: 'string', example: 'CG' },
          background: { type: 'string', example: 'Outlander' },
          hitPoints: { type: 'integer', example: 24 },
          campaign: { type: ['string', 'null'], example: null }
        }
      },
      Campaign: {
        type: 'object',
        required: ['name', 'dm'],
        properties: {
          name: { type: 'string', example: 'Lost Mines Wednesday' },
          dm: { type: 'string', example: 'dm@example.com' },
          description: { type: 'string', example: 'Bi-weekly session' },
          players: {
            type: 'array',
            items: { type: 'string' },
            example: ['p1@example.com']
          },
          system: { type: 'string', example: 'D&D 5e' },
          status: {
            type: 'string',
            enum: ['active', 'paused', 'finished'],
            example: 'active'
          }
        }
      },
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Validation failed' },
          details: { type: 'array', items: { type: 'object' } }
        }
      }
    }
  },
  // Global security; public routes should include `#swagger.security = []`
  security: [{ bearerAuth: [] }]
};

const outputFile = './swagger.json';
// Only point to index.js so mounted route prefixes are detected
const endpointsFiles = ['./index.js'];

// Generate OpenAPI 3.0 definition
swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc);
