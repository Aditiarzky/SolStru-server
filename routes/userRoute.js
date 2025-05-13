const Router = require( "express");
const UserController = require( "../controller/userController.js");
const authenticateToken = require( "../middleware/authMiddleware.js");

const router = Router();

router.get("/", authenticateToken, UserController.getAllUsers);
router.get("/:id", authenticateToken, UserController.getUserById);
router.patch("/:id", authenticateToken, UserController.updateUser);
router.post("/", UserController.createUser);
router.delete("/:id", authenticateToken, UserController.deleteUser);

module.exports = router;