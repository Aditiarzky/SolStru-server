const express = require('express');
const router = express.Router();

// Get all projects
router.get('/', async (req, res) => {
  try {
    const result = await req.pool.query('SELECT * FROM projek');
    res.json({ status: "success", message: 'Success get all data', data: result.rows });
  } catch (err) {
    res.status(500).json({
        status: "error",
        message: err.message
    });
  }
});

// Get project by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await req.pool.query('SELECT * FROM projek WHERE pjid = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Project not found' });
    res.json({ status: "success", message: 'Success get data', data: result.rows[0] });
  } catch (err) {
    res.status(500).json({
        status: "error",
        message: err.message
    });
  }
});

// Add a project
router.post('/', async (req, res) => {
  const {
    foto_pj,
    nama_pj,
    alamat_pj,
    jenis_layanan,
    luas_tanah,
    luas_bangunana,
    kamar_tidur,
    kamar_mandi,
    kamar_art,
    kapasitas_mobil,
    lantai,
    pendukung,
    gaya_bangunan,
    deskripsi
  } = req.body;
  try {
    const result = await req.pool.query(
      `INSERT INTO projek (foto_pj, nama_pj, alamat_pj, jenis_layanan, luas_tanah, luas_bangunana, kamar_tidur, kamar_mandi, kamar_art, kapasitas_mobil, lantai, pendukung, gaya_bangunan, deskripsi)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING *`,
      [
        foto_pj,
        nama_pj,
        alamat_pj,
        jenis_layanan,
        luas_tanah,
        luas_bangunana,
        kamar_tidur,
        kamar_mandi,
        kamar_art,
        kapasitas_mobil,
        lantai,
        pendukung,
        gaya_bangunan,
        deskripsi
      ]
    );

    res.status(201).json({ status: "success", message: 'Project added', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({
        status: "error",
        message: err.message
    });
  }
});

// Update a project
router.put('/:id', async (req, res) => {
  const {
    foto_pj,
    nama_pj,
    alamat_pj,
    jenis_layanan,
    luas_tanah,
    luas_bangunana,
    kamar_tidur,
    kamar_mandi,
    kamar_art,
    kapasitas_mobil,
    lantai,
    pendukung,
    gaya_bangunan,
    deskripsi,
  } = req.body;
  try {
    const result = await req.pool.query(
      `UPDATE projek SET foto_pj=$1, nama_pj=$2, alamat_pj=$3, jenis_layanan=$4, luas_tanah=$5, luas_bangunana=$6, kamar_tidur=$7, kamar_mandi=$8, kamar_art=$9, kapasitas_mobil=$10, lantai=$11, pendukung=$12, gaya_bangunan=$13, deskripsi=$14 WHERE pjid=$15 RETURNING *`,
      [
        foto_pj,
        nama_pj,
        alamat_pj,
        jenis_layanan,
        luas_tanah,
        luas_bangunana,
        kamar_tidur,
        kamar_mandi,
        kamar_art,
        kapasitas_mobil,
        lantai,
        pendukung,
        gaya_bangunan,
        deskripsi,
        req.params.id,
      ]
    );
    if (result.rows.length === 0) 
        return res.status(404).json({
            status: "error",
            message: "project not found"
        });
    res.json({ status: "success", message: 'Project Edited', data: result.rows[0] });
  } catch (err) {
    res.status(500).json({
        status: "error",
        message: err.message
    });
  }
});

// Delete a project
router.delete('/:id', async (req, res) => {
  try {
    const result = await req.pool.query('DELETE FROM projek WHERE pjid = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Project not found' });
    res.json({ message: 'Project deleted', project: result.rows[0] });
  } catch (err) {
    res.status(500).json({
        status: "error",
        message: err.message
    });
  }
});

module.exports = router;
