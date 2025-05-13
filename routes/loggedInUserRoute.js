const Router = require("express");
const AuthenticateToken = require("../middleware/authMiddleware.js");
const LoggedInUserController = require("../controller/loggedInUserController.js");

const router = Router();

router.get("/", AuthenticateToken, LoggedInUserController.getLoggedInUserById);
router.patch("/update/:id", AuthenticateToken, LoggedInUserController.updateLoggedInUser);

module.exports = router;