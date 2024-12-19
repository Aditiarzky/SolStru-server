const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all projects
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Projek');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get project by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Projek WHERE PJID = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Project not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a project
router.post('/', async (req, res) => {
  const { FOTO_PJ, NAMA_PJ, ALAMAT_PJ, JENIS_LAYANAN, LUAS_TANAH, LUAS_BANGUNANA, KAMAR_TIDUR, KAMAR_MANDI, KAMAR_ART, KAPASITAS_MOBIL, LANTAI, PENDUKUNG, GAYA_BANGUNAN } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO Projek (FOTO_PJ, NAMA_PJ, ALAMAT_PJ, JENIS_LAYANAN, LUAS_TANAH, LUAS_BANGUNANA, KAMAR_TIDUR, KAMAR_MANDI, KAMAR_ART, KAPASITAS_MOBIL, LANTAI, PENDUKUNG, GAYA_BANGUNAN)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING *`,
      [FOTO_PJ, NAMA_PJ, ALAMAT_PJ, JENIS_LAYANAN, LUAS_TANAH, LUAS_BANGUNANA, KAMAR_TIDUR, KAMAR_MANDI, KAMAR_ART, KAPASITAS_MOBIL, LANTAI, PENDUKUNG, GAYA_BANGUNAN]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a project
router.put('/:id', async (req, res) => {
  const { FOTO_PJ, NAMA_PJ, ALAMAT_PJ, JENIS_LAYANAN, LUAS_TANAH, LUAS_BANGUNANA, KAMAR_TIDUR, KAMAR_MANDI, KAMAR_ART, KAPASITAS_MOBIL, LANTAI, PENDUKUNG, GAYA_BANGUNAN } = req.body;
  try {
    const result = await pool.query(
      `UPDATE Projek SET FOTO_PJ=$1, NAMA_PJ=$2, ALAMAT_PJ=$3, JENIS_LAYANAN=$4, LUAS_TANAH=$5, LUAS_BANGUNANA=$6, KAMAR_TIDUR=$7, KAMAR_MANDI=$8, KAMAR_ART=$9, KAPASITAS_MOBIL=$10, LANTAI=$11, PENDUKUNG=$12, GAYA_BANGUNAN=$13 WHERE PJID=$14 RETURNING *`,
      [FOTO_PJ, NAMA_PJ, ALAMAT_PJ, JENIS_LAYANAN, LUAS_TANAH, LUAS_BANGUNANA, KAMAR_TIDUR, KAMAR_MANDI, KAMAR_ART, KAPASITAS_MOBIL, LANTAI, PENDUKUNG, GAYA_BANGUNAN, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Project not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a project
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM Projek WHERE PJID = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Project not found' });
    res.json({ message: 'Project deleted', project: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
