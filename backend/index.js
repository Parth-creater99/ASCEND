import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { connectDB } from './db.js';
import User from './models/User.js';
import Store from './models/Store.js';
import { protect } from './middleware/auth.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });
};

// ---------------------------------------------------------
// AUTH ROUTES
// ---------------------------------------------------------
app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ username, password });
    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ---------------------------------------------------------
// STORE ROUTES (Secured by JWT)
// ---------------------------------------------------------
app.get('/api/store/:key', protect, async (req, res) => {
  const { key } = req.params;
  try {
    const record = await Store.findOne({ userId: req.user._id, key });
    res.json({ value: record ? record.value : null });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/store/:key', protect, async (req, res) => {
  const { key } = req.params;
  const { value } = req.body;
  try {
    const record = await Store.findOneAndUpdate(
      { userId: req.user._id, key },
      { value },
      { new: true, upsert: true }
    );
    res.json({ success: true, record });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
