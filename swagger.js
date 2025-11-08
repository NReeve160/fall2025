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
    { name: 'Adventurers', description: 'Create, read, update, delete adventurers' },
    { name: 'Campaigns', description: 'Manage campaigns and their members' },
    { name: 'Auth', description: 'Authentication flows and helpers' },
    { name: 'Health', description: 'Service health' }
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
          'name', 'race', 'class', 'level',
          'alignment', 'background', 'hitPoints'
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
          players: { type: 'array', items: { type: 'string' }, example: ['p1@example.com'] },
          system: { type: 'string', example: 'D&D 5e' },
          status: { type: 'string', enum: ['active', 'paused', 'finished'], example: 'active' }
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
  // Global security means all endpoints are protected by default;
  // mark public ones with `#swagger.security = []` in the route.
  security: [{ bearerAuth: [] }]
};

const outputFile = './swagger.json';
const endpointsFiles = ['./index.js']; // your main entry (swagger-autogen will crawl your routers)

swaggerAutogen()(outputFile, endpointsFiles, doc);
