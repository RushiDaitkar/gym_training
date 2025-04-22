const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  post: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,  // Store the image file path or URL
    required: true,
  },
}, { timestamps: true });

const Trainer = mongoose.model('Trainer', trainerSchema);

module.exports = Trainer;
