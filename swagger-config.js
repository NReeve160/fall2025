const express = require('express');
const app = express();
const adventurers = require('./routes/adventurers');

app.use('/adventurers', adventurers);

module.exports = app;
