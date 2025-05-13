const ProjectService = require("../services/projectServices");

class ProjectController {
  static async getAll(req, res) {
    try {
      const data = await ProjectService.getAllProject();
      res.json({ success: true, data: data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getById(req, res) {
    try {
      const data = await ProjectService.getProjectById(parseInt(req.params.id));
      if (!data) return res.status(404).json({ success: false, message: "Not found" });
      res.json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async create(req, res) {
    try {
      const created = await ProjectService.createProject(req.body);
      res.status(201).json({ success: true, data: created });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async update(req, res) {
    try {
      const updated = await ProjectService.updateProject(parseInt(req.params.id), req.body);
      if (!updated) return res.status(404).json({ success: false, message: "Not found" });
      res.json({ success: true, data: updated });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async delete(req, res) {
    try {
      const deleted = await ProjectService.deleteProject(parseInt(req.params.id));
      if (!deleted) return res.status(404).json({ success: false, message: "Not found" });
      res.json({ success: true, message: "Deleted successfully" });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

module.exports = ProjectController;
