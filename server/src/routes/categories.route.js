const express = require("express");

const { auth, permit, validate } = require("../middleware");
const { role } = require("../constants/employee");
const { roles } = require("../providers/permissions");

const Category = require("../models/categories.model");
const categoryController = require("../controllers/categories.controller");
const router = express.Router();

router.get("/", [auth, permit({ allow: [roles(role.EMPLOYEE, role.MANAGER)] })], categoryController.getAll);

router.post(
  "/",
  [auth, permit({ allow: [roles(role.EMPLOYEE, role.MANAGER)] }), validate(Category.validate)],
  categoryController.create
);

router.put(
  "/:id",
  [auth, permit({ allow: [roles(role.MANAGER)] })],
  validate(Category.validate),
  categoryController.update
);

router.delete("/:id", [auth, permit({ allow: [roles(role.MANAGER)] })], categoryController.remove);

module.exports = router;
