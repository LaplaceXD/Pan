const express = require("express");

const auth = require("../../middleware/auth");
const employeeController = require("../controllers/employee.controller");
const router = express.Router();

router.post("/", [auth], employeeController.create);

module.exports = router;
