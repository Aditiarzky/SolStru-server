const express = require("express");
const AuthenticateToken = require("../middleware/authMiddleware.js");
const OrderController = require("../controller/orderController");

const router = express.Router();

router.get("/", AuthenticateToken, OrderController.getAll);
router.get("/:id", AuthenticateToken, OrderController.getById);
router.post("/", AuthenticateToken, OrderController.create);
router.patch("/:id", AuthenticateToken, OrderController.update);
router.delete("/:id", AuthenticateToken, OrderController.delete);

module.exports = router;
