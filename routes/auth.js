const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const router = express.Router();

// Endpoint untuk login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username dan password harus diisi.' });
    }
    try {
        const result = await req.pool.query(
          `SELECT * FROM "user" WHERE username = $1`,
          [username]
        );
        const user = result.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Password salah.' });

        // buat token JWT
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
        res.status(201).json({ success: true, message: 'Login successed', datatoken: token  });
      } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// Endpoint untuk register (opsional)
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username dan password harus diisi.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user ke database

    try {
        const result = await req.pool.query(
          `INSERT INTO "user" (username, password)
           VALUES ($1, $2)
           RETURNING *`,
          [username, hashedPassword]
        );
        res.status(201).json({ status: "success", message: 'Order added', data: result.rows[0] });
      } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message
        });
    }
});

module.exports = router;
