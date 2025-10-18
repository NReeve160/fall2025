const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  favoriteColor: { type: String, required: true },  // <-- required now
  birthday: { type: String },
});

module.exports = mongoose.model('Contact', contactSchema);
