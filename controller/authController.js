const AuthServices = require("../services/authServices.js");

class AuthController {
    static async login(req, res) {
      try {
        const { email, password } = req.body;
  
        if (!email || !password) {
          return res.status(400).json({ success: false, message: "email and password are required" });
        }
  
        const response = await AuthServices.login(email, password, res);
        res.status(200).json(response);
      } catch (error) {
        res.status(401).json({ success: false, message: error.message || "An unexpected error occurred" });
      }
    }
    static async logout(req, res) {
      await AuthServices.logout(req, res);
    }

    static async register (req, res) {
      try{
        const {name, password, email, alamat_usr, telepon} = req.body;
        
        if (!name) throw new Error('name wajib diisi');
        if (!password) throw new Error('Password wajib diisi');
        if (!email) throw new Error('Email wajib diisi');
        if (!alamat_usr) throw new Error('Alamat wajib diisi');
        if (!telepon) throw new Error('Telepon wajib diisi');

        const response = await AuthServices.register(name, password, email, alamat_usr, telepon);
        res.status(200).json(response)
      } catch (error) {
        res.status(401).json({ success: false, message: error.message || "An unexpected error occurred" });
    }
  }
  static async statusAuth(req, res) {
    res.status(200).json({ success: true, message: "You're logged in" });
  }
  static async refreshToken(req, res) {
    await AuthServices.refreshToken(req, res);
  }
}

module.exports = AuthController;