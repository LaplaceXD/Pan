const express = require("express");

const authController = require("../controllers/auth.controller");
const { validate, auth } = require("../middleware");

const router = express.Router();

router.post("/login", authController.login);
router.post("/refresh", validate(authController.validateTokenPair), authController.refresh);
router.post("/logout", [auth, validate(authController.validateTokenPair)], authController.logout);

module.exports = router;
