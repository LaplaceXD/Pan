const express = require("express");

const { auth, permit, validate } = require("../middleware");
const { role } = require("../constants/employee");
const { roles } = require("../providers/permissions");

const Supplier = require("../models/supplier.model");
const supplierController = require("../controllers/supplier.controller");
const router = express.Router();

router.get("/", [auth, permit({ allow: [roles(role.MANAGER,role.EMPLOYEE)] })], supplierController.getAll);

router.get("/emp", [auth, permit({ allow: [roles(role.EMPLOYEE)] })], supplierController.getAll); //Employee version

router.get("/:id", [auth, permit({ allow: [roles(role.MANAGER)] })], supplierController.getById);

router.post(
  "/",
  [auth, permit({ allow: [roles(role.MANAGER)] }), validate(Supplier.validate)],
  supplierController.create
);

router.put(
  "/:id",
  [auth, permit({ allow: [roles(role.MANAGER)] }), validate(Supplier.validate)],
  supplierController.update
);

router.put(
  "/:id/status",
  [auth, permit({ allow: [roles(role.MANAGER)] })],
  supplierController.toggleStatus
);

module.exports = router;
