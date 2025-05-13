const NotificationService = require('../services/notificationServices');

class NotificationController {
  static async getNotification(req, res) {
    const uid = req.user.id;
    try {
      const data = await NotificationService.getByUserId(uid);
      res.json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async create(req, res) {  
    try {
        const data = req.body; 
        
      const created = await NotificationService.create(data);
      res.status(200).json({ success: true, message: "Notification sended.", data: created });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
  
  static async tandaiDibaca(req, res) {
    const uid = req.user.id;
    const id = parseInt(req.params.id);

    try {
      await NotificationService.tandaiDibaca(id, uid);
      res.json({ success: true, message: "Notification mark as read." });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async hapus(req, res) {
    const uid = req.user.id;
    const id = parseInt(req.params.id);

    try {
      await NotificationService.hapus(id, uid);
      res.json({ success: true, message: "Notification dihapus." });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

module.exports = NotificationController;
