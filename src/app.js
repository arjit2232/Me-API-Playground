const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const Profile = require('./models/Profile');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static frontend
app.use(express.static(path.join(__dirname, 'public')));

// Mongo connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/me_api_playground';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Create profile
app.post('/api/profile', async (req, res) => {
  try {
    const existing = await Profile.findOne();
    if (existing) {
      return res.status(400).json({ message: 'Profile already exists. Use PUT /api/profile to update.' });
    }
    const profile = new Profile(req.body);
    await profile.save();
    res.status(201).json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create profile', error: err.message });
  }
});

app.get('/api/profile', async (req, res) => {
  try {
    const profile = await Profile.findOne();
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
  }
});


app.put('/api/profile', async (req, res) => {
  try {
    const updated = await Profile.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
      runValidators: true
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
});


app.delete('/api/profile', async (req, res) => {
  try {
    await Profile.deleteMany({});
    res.json({ message: 'Profile deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete profile', error: err.message });
  }
});


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
