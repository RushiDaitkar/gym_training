const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  image: {
    type: String, // This will store the image path or URL
    required: true,
  },
  class_name: {
    type: String,
    required: true,
    trim: true,
  },
  teacher_name: {
    type: String,
    required: true,
    trim: true,
  },
  time: {
    type: String, // You can use a Date if you prefer
    required: true,
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Class', classSchema);
