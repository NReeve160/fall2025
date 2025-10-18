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
  consumes: ["application/json"],   // 👈 Add this line
  produces: ["application/json"],   // 👈 And this line
  definitions: {
    Adventurer: {
      name: "Lirael",
      class: "Rogue",
      level: 5,
    },
  },
};

const outputFile = path.join(__dirname, 'swagger-output.json');
const endpointsFiles = [path.join(__dirname, 'swagger-config.js')];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('✅ Swagger file generated successfully!');
});
