const express = require("express");

const { auth, allow, validate } = require("../middleware");
const { role } = require("../constants/employee");
const { roles } = require("../providers/permissions");

const Supplier = require("../models/supplier.model");
const supplierController = require("../controllers/supplier.controller");
const router = express.Router();

router.get("/", [auth, allow(roles(role.MANAGER))], supplierController.view);
router.post(
    "/", 
    [auth, allow(roles(role.MANAGER)), validate(Supplier.validate)], 
    supplierController.create
);
router.put(
    "/:id", 
    [auth, allow(roles(role.MANAGER)), validate(Supplier.validate)], 
    supplierController.edit);
router.put("/:id/status", [auth, allow(roles(role.MANAGER))], supplierController.toggleStatus);

module.exports = router;
