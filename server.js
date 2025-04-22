const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const classRoutes = require('./routes/classRoutes');
const trainerRoutes = require('./routes/trainerRoutes')
const app = express();
// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads')); // Serve images as static files

// Connect to MongoDB
mongoose
    .connect('mongodb://127.0.0.1:27017/workout', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Could not connect to MongoDB:', err));

// Routes

app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/trainers', trainerRoutes);

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

app.get("/", (req, res) => {
    res.set({
        "Allow-access-Allow-Origin": "*",
    });
    return res.redirect("index.html");
})