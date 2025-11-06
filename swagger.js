// swagger.js
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Adventurers Guild API',
    version: '1.0.0',
    description:
      'Manage D&D campaigns and adventurers. JWT-secured. Includes linking adventurers to campaigns and filtering.'
  },
  servers: [
    { url: 'http://localhost:8080' },
    { url: 'https://fall2025.onrender.com' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
    },
    schemas: {
      Adventurer: {
        type: 'object',
        required: [
          'name','race','class','level','hitPoints',
          'strength','dexterity','constitution','intelligence','wisdom','charisma',
          'owner'
        ],
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          race: { type: 'string' },
          class: { type: 'string' },
          level: { type: 'integer', minimum: 1, maximum: 20 },
          alignment: { type: 'string' },
          background: { type: 'string' },
          hitPoints: { type: 'integer', minimum: 1 },
          strength: { type: 'integer', minimum: 1, maximum: 30 },
          dexterity: { type: 'integer', minimum: 1, maximum: 30 },
          constitution: { type: 'integer', minimum: 1, maximum: 30 },
          intelligence: { type: 'integer', minimum: 1, maximum: 30 },
          wisdom: { type: 'integer', minimum: 1, maximum: 30 },
          charisma: { type: 'integer', minimum: 1, maximum: 30 },
          owner: { type: 'string', description: 'User ObjectId' },
          campaign: { type: 'string', nullable: true, description: 'Campaign ObjectId' }
        }
      },
      Campaign: {
        type: 'object',
        required: ['name','dm'],
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          dm: { type: 'string', description: 'DM User ObjectId' },
          players: { type: 'array', items: { type: 'string' } },
          system: { type: 'string', default: 'D&D 5e' },
          status: { type: 'string', enum: ['active','paused','finished'], default: 'active' }
        }
      }
    }
  },
  security: [{ bearerAuth: [] }],
  tags: [
    { name: 'Auth', description: 'Dev login (testing only)' },
    { name: 'Adventurers', description: 'Player characters' },
    { name: 'Campaigns', description: 'Game campaigns' },
    { name: 'System', description: 'Health/status' }
  ]
};

const outputFile = './swagger.json';     // ← the file Swagger-UI will load
const endpointsFiles = ['./index.js'];   // ← your entry that mounts all routes

swaggerAutogen(outputFile, endpointsFiles, doc);
