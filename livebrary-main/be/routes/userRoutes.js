const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const { verifyToken } = require("../middlewares/middleware");

router.get("/getAll", verifyToken, usersController.getAllUser);
router.post("/register", usersController.registerUser);
router.post("/login", usersController.loginUser);
router.put("/:userId", verifyToken, usersController.editUser);
router.get("/:userId", verifyToken, usersController.getUserById);

module.exports = router;
