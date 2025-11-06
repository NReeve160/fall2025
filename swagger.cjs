// swagger.cjs
const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.3' });

const doc = {
  openapi: '3.0.3',
  info: {
    title: 'Adventurers Guild API',
    version: '1.0.0',
    description: 'API documentation for Adventurers Guild'
  },
  servers: [{ url: 'http://localhost:8080' }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
    },
    schemas: {
      Character: {
        type: 'object',
        required: ['name','race','class','level','hitPoints','strength','dexterity','constitution','intelligence','wisdom','charisma','owner'],
        properties: {
          name: { type: 'string', example: 'Dai Jing' },
          race: { type: 'string', example: 'Halfling' },
          class: { type: 'string', example: 'Monk' },
          level: { type: 'integer', example: 5, minimum: 1, maximum: 20 },
          alignment: { type: 'string', example: 'NG' },
          background: { type: 'string', example: 'Country doctor' },
          hitPoints: { type: 'integer', example: 38 },
          strength: { type: 'integer', example: 10 },
          dexterity: { type: 'integer', example: 18 },
          constitution: { type: 'integer', example: 12 },
          intelligence: { type: 'integer', example: 14 },
          wisdom: { type: 'integer', example: 16 },
          charisma: { type: 'integer', example: 12 },
          owner: { type: 'string', example: '60c72b2f9f1b8b001c8a0001' },
          campaign: { type: 'string', nullable: true, example: '60c72b2f9f1b8b001c8a0002' }
        }
      },
      Campaign: {
        type: 'object',
        required: ['name','dm'],
        properties: {
          name: { type: 'string', example: 'Shattered Isles' },
          description: { type: 'string', example: 'Floating islands campaign.' },
          dm: { type: 'string', example: '60c72b2f9f1b8b001c8a0001' },
          players: { type: 'array', items: { type: 'string' } },
          system: { type: 'string', example: 'D&D 5e' },
          status: { type: 'string', enum: ['active','paused','finished'], example: 'active' }
        }
      }
    }
  },
  security: [{ bearerAuth: [] }]
};

const outputFile = './swagger.json';
const endpointsFiles = ['./index.js', './routes/*.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('✅ swagger.json generated');
});
