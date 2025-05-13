const OrderService = require("../services/orderServices");

class orderController {
  static async getAll(req, res) {
    try {
      const data = await OrderService.getAllOrder();
      res.json({ success: true, data: data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getById(req, res) {
    try {
      const data = await OrderService.getOrderById(parseInt(req.params.id));
      if (!data) return res.status(404).json({ success: false, message: "Not found" });
      res.json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async create(req, res) {
    try {
      const userId = req.user?.id; 
  
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
  
      const data = { ...req.body, uid: userId };
      const created = await OrderService.createOrder(data);
      res.status(201).json({ success: true, message: "Order created", data: created });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
  

  static async update(req, res) {
    try {
      const updated = await OrderService.updateOrder(parseInt(req.params.id), req.body);
      if (!updated) return res.status(404).json({ success: false, message: "Not found" });
      res.json({ success: true, data: updated });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async delete(req, res) {
    try {
      const deleted = await OrderService.deleteOrder(parseInt(req.params.id));
      if (!deleted) return res.status(404).json({ success: false, message: "Not found" });
      res.json({ success: true, message: "Deleted successfully" });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

module.exports = orderController;
