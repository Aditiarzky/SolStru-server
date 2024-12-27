const express = require('express');
const router = express.Router();

// Get all orders
router.get('/', async (req, res) => {
  try {
    const result = await req.pool.query('SELECT * FROM pesanan ORDER BY GREATEST(created_at, edited_at) DESC');
    res.json({
        success: true,
        message: "Success get data",
        data: result.rows
    });;
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await req.pool.query('SELECT * FROM pesanan WHERE psid = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    res.json({
        success: true,
        message: "Success get data",
        data: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({
        success: false,
        message: err.message
    });
  }
});

// Add an order
router.post('/', async (req, res) => {
  const { email, nama_ps, alamat_ps, jlayanan_ps, status_pesan } = req.body;
  try {
    const result = await req.pool.query(
      `INSERT INTO pesanan (email, nama_ps, alamat_ps, jlayanan_ps, status_pesan)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [email, nama_ps, alamat_ps, jlayanan_ps, status_pesan]
    );
    res.status(201).json({ success: true, message: 'Order added', data: result.rows[0] });
  } catch (err) {
    res.status(500).json({
        success: false,
        message: err.message
    });
  }
});

// Update an order
router.put('/:id', async (req, res) => {
  const { email, nama_ps, alamat_ps, jlayanan_ps, status_pesan } = req.body;
  try {
    const result = await req.pool.query(
      `UPDATE pesanan SET email=$1, nama_ps=$2, alamat_ps=$3, jlayanan_ps=$4, status_pesan=$5 WHERE psid=$6 RETURNING *`,
      [email, nama_ps, alamat_ps, jlayanan_ps, status_pesan, req.params.id]
    );
    if (result.rows.length === 0)
        return res.status(404).json({
            success: false,
            message: "Order not found"
        });
    res.json({ success: true, message: 'Order edited', data: result.rows[0] });
  } catch (err) {
    res.status(500).json({
        success: false,
        message: err.message
    });
  }
});

// Delete an order
router.delete('/:id', async (req, res) => {
  try {
    const result = await req.pool.query('DELETE FROM pesanan WHERE psid = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0)
        return res.status(404).json({
            success: false,
            message: "Order not found"
        });
    res.json({ success: true, message: 'Order deleted', data: result.rows[0] });
  } catch (err) {
    res.status(500).json({
        success: false,
        message: err.message
    });
  }
});

module.exports = router;
