const express = require('express');
const multer = require('multer');
const path = require('path');
const Trainer = require('../models/Trainer');
const router = express.Router();

// Set up storage for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Create a new trainer
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, post, description } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';

    const newTrainer = new Trainer({
      name,
      post,
      description,
      image,
    });

    await newTrainer.save();
    res.status(201).json(newTrainer);
  } catch (err) {
    res.status(400).json({ error: 'Unable to add trainer' });
  }
});

// Get all trainers
router.get('/', async (req, res) => {
  try {
    const trainers = await Trainer.find();
    res.status(200).json(trainers);
  } catch (err) {
    res.status(400).json({ error: 'Unable to fetch trainers' });
  }
});

// Get a trainer by ID
router.get('/:id', async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      return res.status(404).json({ error: 'Trainer not found' });
    }
    res.status(200).json(trainer);
  } catch (err) {
    res.status(400).json({ error: 'Unable to fetch trainer' });
  }
});

// Update a trainer
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, post, description } = req.body;
    const image = req.file ? req.file.filename : undefined;

    const trainer = await Trainer.findByIdAndUpdate(
      req.params.id,
      { name, post, description, image },
      { new: true }
    );

    if (!trainer) {
      return res.status(404).json({ error: 'Trainer not found' });
    }

    res.status(200).json(trainer);
  } catch (err) {
    res.status(400).json({ error: 'Unable to update trainer' });
  }
});

// Delete a trainer
router.delete('/:id', async (req, res) => {
  try {
    const trainer = await Trainer.findByIdAndDelete(req.params.id);
    if (!trainer) {
      return res.status(404).json({ error: 'Trainer not found' });
    }
    res.status(200).json({ message: 'Trainer deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Unable to delete trainer' });
  }
});

module.exports = router;
