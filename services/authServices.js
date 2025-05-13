const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const pool = require("../db.js");

const ACCESS_TOKEN_EXPIRES_IN = "1h";
const REFRESH_TOKEN_EXPIRES_IN_DAYS = 7;

class AuthServices {
  static async login(email, password, res) {
    const result = await pool.query(`SELECT * FROM "user" WHERE email = $1`, [email]);
    const user = result.rows[0];

    if (!user) return { success: false, message: "Kredensial tidak cocok." };
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return { success: false, message: "Password salah." };

    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: `${REFRESH_TOKEN_EXPIRES_IN_DAYS}d` }
    );

    const refreshExpiry = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000);

    await pool.query(
      `UPDATE "user" SET refresh_token = $1, refresh_token_expiry = $2 WHERE id = $3`,
      [refreshToken, refreshExpiry, user.id]
    );

    res.cookie("authToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: REFRESH_TOKEN_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
    });

    return { success: true, message: "Login successful", role: user.role};
  }

  static async register(name, password, email, alamat_usr, telepon) {
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const result = await pool.query(
        `INSERT INTO "user" (name, password, email, alamat_usr, telepon)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [name, hashedPassword, email, alamat_usr, telepon]
      );
      return {
        success: true,
        message: "User berhasil terdaftar.",
        data: result.rows[0],
      };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  static async logout(req, res) {
    const userId = req.user?.id;

    if (userId) {
      await pool.query(
        `UPDATE "user" SET refresh_token = NULL, refresh_token_expiry = NULL WHERE id = $1`,
        [userId]
      );
    }
    if (!userId) {
      res.status(400).json({success:false, message: "You're not logged in"})
    }

    res.clearCookie("authToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ success: true, message: "Logout successful" });
  }

  static async refreshToken(req, res) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ success: false, message: "No refresh token provided" });
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const userResult = await pool.query(`SELECT * FROM "user" WHERE id = $1`, [decoded.id]);
      const user = userResult.rows[0];

      if (
        !user ||
        user.refresh_token !== refreshToken ||
        new Date(user.refresh_token_expiry) < new Date()
      ) {
        return res.status(403).json({ success: false, message: "Invalid or expired refresh token" });
      }

      const newAccessToken = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
      );

      res.cookie("authToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000,
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
      });

      res.status(200).json({ success: true, message: "Access token refreshed" });
    } catch (err) {
      res.status(403).json({ success: false, message: "Invalid refresh token" });
    }
  }
}

module.exports = AuthServices;
