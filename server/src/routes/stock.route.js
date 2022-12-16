const express = require("express");

const { auth, permit, validate } = require("../middleware");
const { role } = require("../constants/employee");
const { roles } = require("../providers/permissions");

const Stock = require("../models/stock.model");
const stockController = require("../controllers/stock.controller");
const router = express.Router();

router.get("/", [auth, permit({ allow: [roles(role.MANAGER)] })], stockController.findAll);

router.put(
  "/:id",
  [auth, permit({ allow: [roles(role.MANAGER)] })],
  validate(Stock.validate),
  stockController.edit
);

router.post(
  "/",
  [auth, permit({ allow: [roles(role.MANAGER)] })],
  validate(Stock.validate),
  stockController.create
);

module.exports = router;
