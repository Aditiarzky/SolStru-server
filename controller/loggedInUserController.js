const {UserServices}= require("../services/userServices");

class LoggedInUserController {
  static async getLoggedInUserById(req, res) {
    try {
      const loggedInUser = req.user;
      const userId = loggedInUser?.id;

      const user = await UserServices.getUserById(userId);

      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      res.json({ success: true, message: "Success get logged in user", data: user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Error fetching user" });
    }
  }

  static async updateLoggedInUser(req, res) {
    try {
      const loggedInUser = req.user;
      const userId = loggedInUser?.id;

      const paramId = parseInt(req.params.id);

      if (!userId || userId !== paramId) {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }

      const updatedUser = await UserServices.updateUser(userId, req.body);

      res.status(200).json({ success: true, message: "User updated successfully", data: updatedUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Error updating user" });
    }
  }
}

module.exports = LoggedInUserController;
