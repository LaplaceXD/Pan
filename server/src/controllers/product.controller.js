const { InternalServerError, NotFound } = require("../../helpers/errors");
const Product = require("../models/product.model");

const PRODUCT_404 = "Product not found.";

const getAll = async (_, res) => {
  const data = await Product.findAll();
  if (!data) throw new InternalServerError();

  res.status(200).send(data);
};

const getById = async (req, res) => {
  const data = await Product.findById(req.params.id);
  if (!data) throw new NotFound(PRODUCT_404);

  res.status(200).send(data);
};

const create = async (req, res) => {
  const product = new Product(req.body);

  const data = await product.save();
  if (!data) throw new InternalServerError();

  res.status(200).send(data);
};

const update = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new NotFound(PRODUCT_404);

  const data = await product.update(req.body);
  if (!data) throw new InternalServerError();

  res.status(200).send(data);
};

const toggleStatus = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new NotFound(PRODUCT_404);

  await product.toggleStatus();

  res.status(200).send({
    message: "Successfully toggled product status.",
  });
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  toggleStatus,
};
