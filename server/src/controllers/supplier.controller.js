const { InternalServerError, NotFound } = require("../../helpers/errors");
const Supplier = require("../models/supplier.model");

const SUPPLIER_404 = "Supplier not found.";

const getAll = async (_, res) => {
  const data = await Supplier.findAll();
  if (!data) throw new InternalServerError();

  res.status(200).send(data);
};

const getById = async (req, res) => {
  const data = await Supplier.findById(req.params.id);
  if (!data) throw new NotFound(SUPPLIER_404);

  res.status(200).send(data);
};

const create = async (req, res) => {
  const supplier = new Supplier(req.body);

  const data = await supplier.save();
  if (!data) throw new InternalServerError();

  res.status(200).send(data);
};

const update = async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);
  if (!supplier) throw new NotFound(SUPPLIER_404);

  const data = await supplier.update(req.body);
  if (!data) throw new InternalServerError();

  res.status(200).send(data);
};

const toggleStatus = async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);
  if (!supplier) throw new NotFound(SUPPLIER_404);

  await supplier.toggleStatus();

  res.status(200).send({
    message: "Successfully toggled supplier status",
  });
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  toggleStatus,
};
