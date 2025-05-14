const pool = require("../db");

class ProjectService {
  static async getAllProject() {
    const result = await pool.query('SELECT * FROM project');
    return result.rows;
  }

  static async getProjectById(pjid) {
    const result = await pool.query('SELECT * FROM project WHERE pjid = $1', [pjid]);
    return result.rows[0];
  }

  static async createProject(data) {
    const result = await pool.query(
      `INSERT INTO project (foto_pj, nama_pj, alamat_pj, jenis_layanan, luas_tanah, luas_bangunana, kamar_tidur, kamar_mandi, kamar_art, kapasitas_mobil, lantai, pendukung, gaya_bangunan, deskripsi)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
      [
        data.foto_pj, data.nama_pj, data.alamat_pj, data.jenis_layanan, data.luas_tanah,
        data.luas_bangunana, data.kamar_tidur, data.kamar_mandi, data.kamar_art,
        data.kapasitas_mobil, data.lantai, data.pendukung, data.gaya_bangunan, data.deskripsi
      ]
    );
    return result.rows[0];
  }

  static async updateProject(pjid, data) {
    const fields = [];
    const values = [];
    let index = 1;

    for (const key in data) {
      if (['edited_at', 'created_at', 'pjid'].includes(key)) continue;
      fields.push(`${key} = $${index}`);
      values.push(data[key]);
      index++;
    }

    values.push(pjid);
    const query = `UPDATE project SET ${fields.join(", ")}, edited_at = CURRENT_TIMESTAMP WHERE pjid = $${index} RETURNING *`;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async deleteProject(pjid) {
    const result = await pool.query('DELETE FROM project WHERE pjid = $1 RETURNING *', [pjid]);
    return result.rows[0];
  }
}

module.exports = ProjectService;
