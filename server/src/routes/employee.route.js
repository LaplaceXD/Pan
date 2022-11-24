const express = require("express");

const { auth, permit, validate } = require("../middleware");
const { role } = require("../constants/employee");
const { roles } = require("../providers/permissions");

const Employee = require("../models/employee.model");
const employeeController = require("../controllers/employee.controller");
const router = express.Router();

router.post(
  "/",
  [auth, permit({ allow: [roles(role.MANAGER)] }), validate(Employee.validate)],
  employeeController.create
);

module.exports = router;
