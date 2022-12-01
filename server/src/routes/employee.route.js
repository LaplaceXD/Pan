const express = require("express");

const { auth, permit, validate } = require("../middleware");
const { role } = require("../constants/employee");
const { roles } = require("../providers/permissions");

const Employee = require("../models/employee.model");
const employeeController = require("../controllers/employee.controller");
const router = express.Router();

router.get(
    "/", 
    [auth, permit({ allow: [roles(role.MANAGER)] }), validate(Employee.validate)],
    employeeController.view
);
router.post(
    "/",
    [auth, permit({ allow: [roles(role.MANAGER)] }), validate(Employee.validate)],
    employeeController.create
);
router.put(
    "/:id",
    [auth, permit({ allow: [roles(role.MANAGER)] }), validate(Employee.validate)],
    employeeController.edit
);
router.post(
    "/:id", 
    [auth, permit({ allow: [roles(role.MANAGER)] }), validate(Employee.validate)],
    employeeController.reset
);
router.put(
    "/:id/status", 
    [auth, permit({ allow: [roles(role.MANAGER)] }), validate(Employee.validate)],
    employeeController.toggleStatus
  
);


module.exports = router;
