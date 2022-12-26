const express = require("express");

const { auth, permit } = require("../middleware");
const { role } = require("../constants/employee");
const { roles } = require("../providers/permissions");

const reportController = require("../controllers/report.controller");
const router = express.Router();

router.get("/sales", [auth, permit({ allow: [roles(role.MANAGER)] })], reportController.salesReport);

router.get(
  "/sales/daily",
  [auth, permit({ allow: [roles(role.EMPLOYEE, role.MANAGER)] })],
  reportController.dailySalesReport
);

router.get("/employee", [auth, permit({ allow: [roles(role.MANAGER)] })], reportController.employeeReport);

router.get(
  "/supplier",
  [auth, permit({ allow: [roles(role.MANAGER)] })],
  reportController.supplierStocksReport
);

router.get(
  "/inventory",
  [auth, permit({ allow: [roles(role.MANAGER)] })],
  reportController.inventoryReport
);

module.exports = router;
