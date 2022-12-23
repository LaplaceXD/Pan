const express = require("express");

const { auth, permit, validate } = require("../middleware");
const { role } = require("../constants/employee");
const { roles } = require("../providers/permissions");

const Report = require("../models/report.model");
const reportController = require("../controllers/report.controller");
const router = express.Router();

router.get(
  "/sales", 
  // [auth, permit({ allow: [roles(role.MANAGER)] })], 
  reportController.salesReport
);

router.get(
  "/employee", 
  // [auth, permit({ allow: [roles(role.MANAGER)] })], 
  reportController.employeeReport
);

router.get(
  "/inventory", 
  // [auth, permit({ allow: [roles(role.MANAGER)] })], 
  reportController.stockReport
);

module.exports = router;
