const mongoose = require('mongoose');

const adventurerSchema = new mongoose.Schema({
  name: String,
  class: String,
  level: Number,
  race: String,
  background: String,
  alignment: String,
  hitPoints: Number
});

module.exports = mongoose.model('Adventurer', adventurerSchema);