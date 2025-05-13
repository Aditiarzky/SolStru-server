const {UserServices, isEmailTaken} = require("../services/userServices.js");

const UserController = {
  async getAllUsers(req, res) {
    try {
      const users = await UserServices.getAllUsers();
      res.json({ success: true, message: "Success get all users", data: users });
    } catch (error) {
      res.status(500).json({ success: false, message: `Error fetching users: ${error}` });
    }
  },

  async getUserById(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const user = await UserServices.getUserById(id);

      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      res.json({ success: true, message: "Success get user", data: user });
    } catch (error) {
      res.status(500).json({ success: false, message: `Error fetching user: ${error}` });
    }
  },

  async createUser(req, res) {
    try {
        const data = req.body;

        const emailExists = await isEmailTaken(data.email);
        if (emailExists) {
          return res.status(400).json({ success: false, message: "Email is already taken" });
        }

      const user = await UserServices.createUser(data);
      res.status(201).json({ success: true, message: "User created successfully", data: user });
    } catch (error) {
      res.status(500).json({ success: false, message: `Error creating user: ${error}` });
    }
  },

  async updateUser(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const user = await UserServices.updateUser(id, req.body);

      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      res.status(200).json({ success: true, message: "User updated successfully", data: user });
    } catch (error) {
      res.status(500).json({ success: false, message: `Error updating user: ${error}` });
    }
  },

  async deleteUser(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const user = await UserServices.deleteUser(id);

      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: `Error deleting user: ${error}` });
    }
  }
};

module.exports = UserController;
