const express = require("express");

const { auth, permit, validate } = require("../middleware");
const { role } = require("../constants/employee");
const { roles, owner, sameRoleAndNotOwner } = require("../providers/permissions");

const Order = require("../models/order.model");
const ordercontroller = require("../controllers/order.controller");
const router = express.Router();

router.get("/", [auth, permit({ allow: [roles(role.MANAGER, role.EMPLOYEE)] })], ordercontroller.getAll);

module.exports = router;