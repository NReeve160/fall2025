const swaggerAutogen = require('swagger-autogen')();
const path = require('path');

const doc = {
  info: {
    title: "Adventurer’s Guild API",
    description: "API for managing D&D adventurers",
    version: "1.0.0",
  },
  host: "localhost:8080",
  schemes: ["http"],
  consumes: ["application/json"],   
  produces: ["application/json"],   
definitions: {
  Adventurer: {
    type: "object",
    properties: {
      name: { type: "string", example: "Lirael" },
      class: { type: "string", example: "Rogue" },
      level: { type: "integer", example: 5 },
      race: { type: "string", example: "Elf" },
      background: { type: "string", example: "Outlander" },
      alignment: { type: "string", example: "Chaotic Good" },
      hitPoints: { type: "integer", example: 42 }
    }
  }
}
};

const outputFile = path.join(__dirname, 'swagger-output.json');
const endpointsFiles = [path.join(__dirname, 'swagger-config.js')];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('✅ Swagger file generated successfully!');
});
