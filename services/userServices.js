const pool = require("../db.js");
const bcrypt = require("bcrypt");

class UserServices {
  static async getAllUsers() {
    const result = await pool.query('SELECT * FROM "user"');
    return result.rows;
  }

  static async getUserById(userId) {
    const result = await pool.query(
      'SELECT * FROM "user" WHERE id = $1',
      [userId]
    );
    return result.rows[0];
  }

  static async createUser(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    try {
      const result = await pool.query(
        `INSERT INTO "user" (name, password, email, alamat_usr, telepon)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [data.name, hashedPassword, data.email, data.alamat_usr, data.telepon]
      );

      return result.rows[0];
    } catch (err) {
      throw new Error(`Failed to create user: ${err.message}`);
    }
  }

  static async updateUser(userId, data) {
    const fields = [];
    const values = [];
    let index = 1;

    for (const key in data) {
      fields.push(`${key} = $${index}`);
      values.push(data[key]);
      index++;
    }

    values.push(userId);

    const query = `UPDATE "user" SET ${fields.join(", ")} WHERE id = $${index} RETURNING *`;

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (err) {
      throw new Error(`Failed to update user: ${err.message}`);
    }
  }

  static async deleteUser(userId) {
    const result = await pool.query(
      'DELETE FROM "user" WHERE id = $1 RETURNING *',
      [userId]
    );
    return result.rows[0];
  }
}

const isEmailTaken = async (email) => {
  const result = await pool.query(
    'SELECT * FROM "user" WHERE email = $1',
    [email]
  );
  return result.rows.length > 0;
};

module.exports = { UserServices, isEmailTaken };
