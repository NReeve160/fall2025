const mongoose = require('mongoose');

const adventurerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  race: { type: String, required: true },
  class: { type: String, required: true },
  level: { type: Number, required: true, min: 1, max: 20 },
  background: String,
  alignment: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Adventurer', adventurerSchema);
