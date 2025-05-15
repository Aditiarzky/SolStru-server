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
      `INSERT INTO notification (uid, judul, pesan, status_ntf) VALUES ($1, $2, $3, $4) RETURNING *`,
      [data.uid, data.judul, data.pesan, data.status_ntf]
    );
    return result.rows[0];
  }

  static async tandaiDibaca(id, uid) {
    if (id !== 0) {
      await pool.query(
        `UPDATE notification SET dibaca = TRUE WHERE id = $1`,
        [id]
      );
    } else if (uid) {
      await pool.query(
        `UPDATE notification SET dibaca = TRUE WHERE uid = $1`,
        [uid]
      );
    } else {
      throw new Error("Either 'id' or 'uid' must be provided.");
    }
  }
  

  static async hapus(id, uid) {
    if (id !== 0){
      await pool.query(
        `DELETE FROM notification WHERE id = $1 AND uid = $2`,
        [id, uid]
      );
    } else if (uid){
      await pool.query(
        `DELETE FROM notification WHERE uid = $1`,
        [uid]
      );
    } else {
      throw new Error("Either 'id' or 'uid' must be provided.");
    }
  }
}

module.exports = NotificationService;
