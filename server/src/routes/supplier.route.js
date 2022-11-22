const express = require("express");

const { auth, allow } = require("../middleware");
const { role } = require("../constants/employee");

const supplierController = require("../controllers/supplier.controller");
const router = express.Router();

router.get("/", [auth, allow(role.MANAGER)], supplierController.view);
router.post("/", [auth, allow(role.MANAGER)], supplierController.create);
router.put("/:id", [auth, allow(role.MANAGER)], supplierController.edit);
router.post("/:id/status", [auth, allow(role.MANAGER)], supplierController.deactivate);

module.exports = router;
