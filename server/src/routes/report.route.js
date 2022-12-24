const express = require("express");

const { auth, permit } = require("../middleware");
const { role } = require("../constants/employee");
const { roles } = require("../providers/permissions");

const reportController = require("../controllers/report.controller");
const router = express.Router();

router.get("/sales", reportController.salesReport);

router.get("/employee", reportController.employeeReport);

router.get("/inventory", reportController.inventoryReport);

module.exports = router;
