const express = require("express");

const authController = require("../controllers/auth.controller");
const { validate } = require("../middleware");

const router = express.Router();

router.post("/login", authController.login);
router.post("/refresh", validate(authController.validateRefreshBody), authController.refresh);

module.exports = router;
