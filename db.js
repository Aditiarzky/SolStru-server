const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Fungsi untuk memeriksa koneksi
const testConnection = async () => {
  try {
    await pool.query('SELECT NOW()'); // Query sederhana untuk tes koneksi
    console.log('Database connected successfully!');
  } catch (err) {
    console.error('Database connection failed:', err.message);
  }
};

module.exports = { pool, testConnection };
