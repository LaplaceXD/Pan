const express = require("express");

const employeeController = require("../controllers/employee.controller");
const router = express.Router();

router.post("/", employeeController.create);

module.exports = router;
