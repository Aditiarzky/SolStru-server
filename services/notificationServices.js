const pool = require('../db');

class NotificationService {
  static async getByUserId(uid) {
    const result = await pool.query(
      `SELECT * FROM notification WHERE uid = $1 ORDER BY created_at DESC`,
      [uid]
    );
    return result.rows;
  }

  static async create(data) {
    const result = await pool.query(
      `INSERT INTO notification (uid, judul, pesan) VALUES ($1, $2, $3) RETURNING *`,
      [data.uid, data.judul, data.pesan]
    );
    return result.rows[0];
  }

  static async tandaiDibaca(id, uid) {
    await pool.query(
      `UPDATE notification SET dibaca = TRUE WHERE id = $1 AND uid = $2`,
      [id, uid]
    );
  }

  static async hapus(id, uid) {
    await pool.query(
      `DELETE FROM notification WHERE id = $1 AND uid = $2`,
      [id, uid]
    );
  }
}

module.exports = NotificationService;
