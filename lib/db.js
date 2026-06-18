// lib/db.js
import pkg from 'pg';

const { Pool } = pkg;

console.log('*** DB URL in db.js ***', process.env.DATABASE_URL);

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in env');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;