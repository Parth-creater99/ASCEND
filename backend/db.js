import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

// Connection string should come from Render environment variables
const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/ascend';

// Render Internal Database URLs DO NOT support SSL.
// Render External Database URLs (which contain onrender.com) REQUIRE SSL.
export const pool = new Pool({
  connectionString,
  ssl: connectionString.includes('onrender.com') ? { rejectUnauthorized: false } : false
});

export const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log("PostgreSQL Connected successfully");
    
    // Auto-create tables if they don't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );
      CREATE TABLE IF NOT EXISTS store (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        key VARCHAR(255) NOT NULL,
        value JSONB NOT NULL,
        UNIQUE(user_id, key)
      );
      CREATE TABLE IF NOT EXISTS friendships (
        id SERIAL PRIMARY KEY,
        requester_id INTEGER REFERENCES users(id),
        recipient_id INTEGER REFERENCES users(id),
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(requester_id, recipient_id)
      );
    `);
    client.release();
  } catch (err) {
    console.error("Failed to connect to PostgreSQL or create tables", err);
  }
};

