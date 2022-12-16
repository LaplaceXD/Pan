const express = require("express");

const { auth, permit, validate } = require("../middleware");
const { role } = require("../constants/employee");
const { roles, owner, sameRoleAndNotOwner } = require("../providers/permissions");

const Employee = require("../models/employee.model");
const employeeController = require("../controllers/employee.controller");
const router = express.Router();

router.get("/", [auth, permit({ allow: [roles(role.MANAGER)] })], employeeController.getAll);

router.get(
  "/:id",
  [auth, permit({ allow: [roles(role.MANAGER), owner], deny: [sameRoleAndNotOwner(Employee)] })],
  employeeController.getById
);

router.post(
  "/",
  [auth, permit({ allow: [roles(role.MANAGER)] }), validate(Employee.validate)],
  employeeController.create
);

router.put(
  "/:id",
  [
    auth,
    permit({ allow: [roles(role.MANAGER), owner], deny: [sameRoleAndNotOwner(Employee)] }),
    validate(Employee.validate),
  ],
  employeeController.update
);

router.put(
  "/:id/password",
  [auth, permit({ allow: [owner] }), validate(Employee.validatePassword)],
  employeeController.changePassword
);

router.post(
  "/:id/password",
  [auth, permit({ allow: [roles(role.MANAGER)] })],
  employeeController.resetPassword
);

router.put(
  "/:id/status",
  [auth, permit({ allow: [roles(role.MANAGER)] })],
  employeeController.toggleStatus
);

module.exports = router;
