const express = require("express");
const router = express.Router();
const userController = require("../controller/UserController");
const {
  authMiddleware,
  authUserMiddleware,
} = require("../middleware/authMiddleware");
router.post("/register", userController.createUser);
router.post("/sign-in", userController.loginUser);
router.post("/log-out", userController.logoutUser);
router.put("/update-user/:id", authUserMiddleware, userController.updateUser);
router.delete("/delete-user/:id", authMiddleware, userController.deleteUser);
router.get("/getAllUser", authMiddleware, userController.getAllUser);
router.get(
  "/get-details/:id",
  authUserMiddleware,
  userController.getDetailsUser,
);

router.post("/refresh-token", userController.refreshToken);
router.delete("/delete-many", authMiddleware, userController.deleteMany);

module.exports = router;
