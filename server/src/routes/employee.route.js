const express = require("express");

const { auth, allow, validate } = require("../middleware");
const { role } = require("../constants/employee");
const { roles } = require("../providers/permissions");

const Employee = require("../models/employee.model");
const employeeController = require("../controllers/employee.controller");
const router = express.Router();

router.post(
  "/",
  [auth, allow(roles(role.MANAGER)), validate(Employee.validate)],
  employeeController.create
);

module.exports = router;
