const pool = require("../db");

class OrderService {
  static async getAllOrder() {
    const result = await pool.query('SELECT * FROM "order"');
    return result.rows;
  }

  static async getOrderById(psid) {
    const result = await pool.query('SELECT * FROM "order" WHERE psid = $1', [psid]);
    return result.rows[0];
  }

  static async createOrder(data) {
    const result = await pool.query(
      `INSERT INTO "order" (nama_ps, alamat_ps, jlayanan_ps, deskripsi_ps, ukuran_ps, tanggal_mulai, uid)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [data.nama_ps, data.alamat_ps, data.jlayanan_ps, data.deskripsi_ps, data.ukuran_ps, data.tanggal_mulai, data.uid]
    );
    return result.rows[0];
  }

  static async updateOrder(psid, data) {
    const fields = [];
    const values = [];
    let index = 1;

    for (const key in data) {
      fields.push(`${key} = $${index}`);
      values.push(data[key]);
      index++;
    }

    values.push(psid);
    const query = `UPDATE "order" SET ${fields.join(", ")}, edited_at = CURRENT_TIMESTAMP WHERE psid = $${index} RETURNING *`;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async deleteOrder(psid) {
    const result = await pool.query('DELETE FROM "order" WHERE psid = $1 RETURNING *', [psid]);
    return result.rows[0];
  }
}

module.exports = OrderService;
