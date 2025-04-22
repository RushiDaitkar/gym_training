const express = require('express');
const Class = require('../models/Class');
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator'); // For input validation

const router = express.Router();

// Set up storage for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Route to create a new class
router.post('/create', 
  upload.single('image'),
  [
    body('class_name').notEmpty().withMessage('Class name is required'),
    body('teacher_name').notEmpty().withMessage('Teacher name is required'),
    body('time').notEmpty().withMessage('Class time is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { class_name, teacher_name, time } = req.body;
      const image = req.file ? `/uploads/${req.file.filename}` : ''; // Image URL

      const newClass = new Class({ class_name, teacher_name, time, image });
      await newClass.save();
      res.status(201).json({ message: 'Class created successfully', newClass });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error, unable to create class.' });
    }
  }
);

// Route to fetch all classes
router.get('/', async (req, res) => {
  try {
    const classes = await Class.find();
    res.status(200).json(classes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error, unable to fetch classes.' });
  }
});

// Route to update a class
router.put('/update/:id', 
  upload.single('image'),
  async (req, res) => {
    const { id } = req.params;
    const { class_name, teacher_name, time } = req.body;
    let updatedData = { class_name, teacher_name, time };

    if (req.file) {
      updatedData.image = `/uploads/${req.file.filename}`; // Update image URL
    }

    try {
      const updatedClass = await Class.findByIdAndUpdate(id, updatedData, { new: true });
      if (!updatedClass) {
        return res.status(404).json({ error: 'Class not found' });
      }
      res.status(200).json({ message: 'Class updated successfully', updatedClass });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error, unable to update class.' });
    }
  }
);

// Route to delete a class
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedClass = await Class.findByIdAndDelete(id);
    if (!deletedClass) {
      return res.status(404).json({ error: 'Class not found' });
    }
    res.status(200).json({ message: 'Class deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error, unable to delete class.' });
  }
});
// Route to fetch a single class by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const classData = await Class.findById(id);
      if (!classData) {
        return res.status(404).json({ error: 'Class not found' });
      }
      res.status(200).json(classData);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error, unable to fetch class.' });
    }
  });
  
module.exports = router;
