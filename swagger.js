const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Contacts API',
    description: 'API for managing contacts',
  },
  host: 'fall2025.onrender.com',
  schemes: ['https'],
  definitions: {
    Contact: {
      firstName: "any",
      lastName: "any",
      email: "any",
      favoriteColor: "any",   // <-- include here
      birthday: "any",
    },
  },
};

swaggerAutogen('./swagger-output.json', ['./index.js'], doc);
