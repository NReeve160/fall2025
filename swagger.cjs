// swagger.cjs
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Adventurers Guild API',
    version: '1.0.0',
    description: 'Manage D&D campaigns and adventurers.'
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
        required: ['name','race','class','level','hitPoints','strength','dexterity','constitution','intelligence','wisdom','charisma','owner'],
        properties: {
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
        },
        example: {
          name: 'Dai Jing',
          race: 'Halfling',
          class: 'Monk',
          level: 5,
          alignment: 'NG',
          background: 'Country doctor',
          hitPoints: 38,
          strength: 10,
          dexterity: 18,
          constitution: 12,
          intelligence: 14,
          wisdom: 16,
          charisma: 12,
          owner: '000000000000000000000001',
          campaign: null
        }
      },
      Campaign: {
        type: 'object',
        required: ['name','dm'],
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          dm: { type: 'string', description: 'DM User ObjectId' },
          players: { type: 'array', items: { type: 'string' } },
          system: { type: 'string', default: 'D&D 5e' },
          status: { type: 'string', enum: ['active','paused','finished'], default: 'active' }
        },
        example: {
          name: 'Shattered Isles',
          description: 'Floating islands campaign.',
          dm: '000000000000000000000010',
          players: [],
          system: 'D&D 5e',
          status: 'active'
        }
      }
    }
  },
  security: [{ bearerAuth: [] }],
  tags: [
    { name: 'Adventurers', description: 'Player characters' },
    { name: 'Campaigns', description: 'Game campaigns' },
    { name: 'Auth', description: 'Dev login for testing' },
    { name: 'System', description: 'Health/status' }
  ]
};

const outputFile = './swagger.json';
const endpointsFiles = ['./index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
