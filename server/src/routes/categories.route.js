const express = require("express");

const { auth, permit, validate } = require("../middleware");
const { role } = require("../constants/employee");
const { roles } = require("../providers/permissions");

const Category = require("../models/categories.model");
const categoryController = require("../controllers/categories.controller");
const router = express.Router();

router.post(
  "/",
  [auth, permit({ allow: [roles(role.MANAGER)] }), validate(Category.validate)],
  categoryController.create
);

router.get("/", [auth, permit({ allow: [roles(role.MANAGER)] })], categoryController.findAll);

router.put(
  "/:id",
  [auth, permit({ allow: [roles(role.MANAGER)] })],
  validate(Category.validate),
  categoryController.edit
);

router.delete("/:id", [auth, permit({ allow: [roles(role.MANAGER)] })], categoryController.remove);

router.put(
  "/:id/status",
  [auth, permit({ allow: [roles(role.MANAGER)] })],
  categoryController.toggleStatus
);

module.exports = router;
