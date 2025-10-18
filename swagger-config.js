// swagger-config.js
const express = require('express');
const app = express();
const adventurers = require('./routes/adventurers');

// 👇 this tells swagger-autogen how routes are mounted
app.use('/adventurers', adventurers);

module.exports = app;
