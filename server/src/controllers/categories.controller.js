const { InternalServerError } = require("../../helpers/errors");
const Category = require("../models/categories.model");

const findAll = async (_, res) => {
  const data = await Category.findAll();
  if (!data) throw new InternalServerError();
  res.status(200).send(data);
};

const create = async (req, res) => {
  const category = new Category(req.body);

  const data = await category.save();
  if (!data) throw new InternalServerError();

  res.status(200).send(data);
};

const edit = async (req, res) => {
  const product = await Category.findById(req.params.id);
  if (!product) throw new NotFound();

  const data = await product.edit(req.body);
  if (!data) throw new InternalServerError();
  res.status(200).send(data);
};

const remove = async (req, res) => {
  console.log("uten");

  const category = await Category.findById(req.params.id);
  if (!category) throw new NotFound();
  await category.delete();

  res.status(200).send({
    error: false,
    status: 200,
    message: "Successfully deleted category.",
  });
};

const toggleStatus = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new NotFound();

  await category.toggleStatus();

  res.status(200).send({
    error: false,
    status: 200,
    message: "Successfully changed category status.",
  });
};

module.exports = {
  create,
  findAll,
  edit,
  remove,
  toggleStatus,
};
