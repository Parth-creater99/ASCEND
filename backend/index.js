import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { connectDB, pool } from './db.js';
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
    const { rows: existingUsers } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const { rows: newUsers } = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
      [username, hashedPassword]
    );

    const user = newUsers[0];
    res.status(201).json({
      _id: user.id,
      username: user.username,
      token: generateToken(user.id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const { rows: users } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = users[0];

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        username: user.username,
        token: generateToken(user.id),
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
    const { rows } = await pool.query('SELECT value FROM store WHERE user_id = $1 AND key = $2', [req.user.id, key]);
    res.json({ value: rows.length > 0 ? rows[0].value : null });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/store/:key', protect, async (req, res) => {
  const { key } = req.params;
  const { value } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO store (user_id, key, value) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (user_id, key) 
       DO UPDATE SET value = $3 
       RETURNING *`,
      [req.user.id, key, JSON.stringify(value)]
    );
    res.json({ success: true, record: rows[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
