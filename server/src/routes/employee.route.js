const express = require("express");

const { auth, allowFor } = require("../../middleware");
const { role } = require("../../constants/employee");

const employeeController = require("../controllers/employee.controller");
const router = express.Router();

router.post("/", [auth, allowFor(role.MANAGER)], employeeController.create);

module.exports = router;
