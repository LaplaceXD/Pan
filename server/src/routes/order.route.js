const express = require("express");

const { auth, permit, validate } = require("../middleware");
const { role } = require("../constants/employee");
const { roles } = require("../providers/permissions");

const Order = require("../models/order.model");
const orderController = require("../controllers/order.controller");
const router = express.Router();

router.get(
    "/", 
    [auth, permit({ allow: [roles(role.MANAGER)] })],
    orderController.view
);
router.post(
    "/",
    [auth, permit({ allow: [roles(role.MANAGER)] })],
    orderController.create
);
// router.put(
//     "/:id",
//     [auth, permit({ allow: [roles(role.MANAGER)] }), validate(Product.validate)],
//     productController.edit
// );
// router.delete(
//     "/:id",
//     [auth, permit({ allow: [roles(role.MANAGER)] })],
//     productController.remove
// );
// router.put(
//     "/:id/status", 
//     [auth, permit({ allow: [roles(role.MANAGER)] })],
//     productController.toggleStatus
// );


module.exports = router;
