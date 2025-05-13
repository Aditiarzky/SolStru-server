const express = require("express");
const ProjectController = require("../controller/projectController");

const router = express.Router();

router.get("/", ProjectController.getAll);
router.get("/:id", ProjectController.getById);
router.post("/", ProjectController.create);
router.patch("/:id", ProjectController.update);
router.delete("/:id", ProjectController.delete);

module.exports = router;
