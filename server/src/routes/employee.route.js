const express = require("express");

const { auth, allow } = require("../middleware");
const { role } = require("../constants/employee");

const employeeController = require("../controllers/employee.controller");
const router = express.Router();

router.post("/", [auth, allow(role.MANAGER)], employeeController.create);
router.put("/:id", [auth, allow(role.MANAGER)], employeeController.edit);
router.post("/:id", [auth, allow(role.MANAGER)], employeeController.reset);
router.put("/:id/status", [auth, allow(role.MANAGER)], employeeController.toggleStatus);

module.exports = router;
