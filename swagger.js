// swagger.js  (ESM + Swagger 2.0 with swagger-autogen)
import swaggerAutogenFactory from 'swagger-autogen';

const swaggerAutogen = swaggerAutogenFactory();

const isProd = process.env.NODE_ENV === 'production';

const doc = {
  swagger: '2.0',
  info: {
    title: 'Adventurer’s Guild API',
    description: 'API for managing D&D adventurers',
    version: '1.0.0',
  },
  host: isProd ? 'fall2025.onrender.com' : 'localhost:8080',
  basePath: '/',
  schemes: [isProd ? 'https' : 'http'],

  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'Use: Bearer <JWT>',
    },
  },
  security: [{ bearerAuth: [] }],

  // OAS2 "definitions" (used by $ref: '#/definitions/...').
  definitions: {
    Adventurer: {
      _id: '671f6a1c5b3c2f9a12345678',
      name: 'Talia Ravenshade',
      class: 'Ranger',
      level: 5,
      race: 'Half-Elf',
      background: 'Outlander',
      alignment: 'CG',
      hitPoints: 42,
      playerId: '0000000000000010',
      campaign: '671f6a1c5b3c2f9a00000001',
      notes: 'Prefers longbows; hates goblins',
    },
    AdventurerCreate: {
      name: 'Talia Ravenshade',
      class: 'Ranger',
      level: 1,
      race: 'Half-Elf',
      background: 'Outlander',
      alignment: 'CG',
      hitPoints: 12,
      playerId: '0000000000000010',
      campaign: '671f6a1c5b3c2f9a00000001',
      notes: 'New character',
    },
    AdventurerUpdate: {
      name: 'Talia Ravenshade',
      level: 6,
      hitPoints: 48,
      notes: 'Leveled up after session 3',
    },

    Campaign: {
      _id: '671f6a1c5b3c2f9a00000001',
      name: 'Rise of the Shards',
      description: 'Floating isles campaign',
      dm: '0000000000000002',
      players: ['0000000000000010'],
      system: '5e',
      status: 'active',
    },
    CampaignCreate: {
      name: 'Rise of the Shards',
      dm: '0000000000000002',
      description: 'Floating isles campaign',
      players: ['0000000000000010'],
      system: '5e',
      status: 'active',
    },
    CampaignUpdate: {
      name: 'Rise of the Shards (rev)',
      status: 'paused',
      description: 'Taking a break',
    },
  },
};

const outputFile = './swagger-output.json';
// Make sure this file imports and mounts ALL your routers so swagger-autogen sees them.
const endpointsFiles = ['./index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
