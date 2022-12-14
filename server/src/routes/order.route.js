const express = require("express");

const { auth, permit, validate } = require("../middleware");
const { role } = require("../constants/employee");
const { roles } = require("../providers/permissions");

const Order = require("../models/order.model");
const orderController = require("../controllers/order.controller");
const router = express.Router();

router.get("/", [auth, permit({ allow: [roles(role.MANAGER, role.EMPLOYEE)] })], orderController.getAll);

router.get(
    "/:id",
    [auth, permit({ allow: [roles(role.MANAGER, role.EMPLOYEE)] })],
    orderController.getById
);

router.post(
    "/",
    [auth, permit({ allow: [roles(role.EMPLOYEE)] }), validate(Order.validate)],
    orderController.create
);

module.exports = router;