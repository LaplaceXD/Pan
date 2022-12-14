const express = require("express");

const { auth, permit, validate } = require("../middleware");
const { role } = require("../constants/employee");
const { roles } = require("../providers/permissions");

const Product = require("../models/product.model");
const productController = require("../controllers/product.controller");
const router = express.Router();

router.get("/", [auth, permit({ allow: [roles(role.MANAGER, role.EMPLOYEE)] })], productController.getAll);

router.get(
  "/:id",
  [auth, permit({ allow: [roles(role.MANAGER, role.EMPLOYEE)] })],
  productController.getById
);

router.post(
  "/",
  [auth, permit({ allow: [roles(role.MANAGER)] }), validate(Product.validate)],
  productController.create
);

router.put(
  "/:id",
  [auth, permit({ allow: [roles(role.MANAGER)] }), validate(Product.validate)],
  productController.update
);

router.put("/:id/status", [auth, permit({ allow: [roles(role.MANAGER)] })], productController.toggleStatus);

module.exports = router;
