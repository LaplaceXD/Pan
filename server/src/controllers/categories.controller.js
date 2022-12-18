const { InternalServerError, NotFound } = require("../../helpers/errors");
const Category = require("../models/categories.model");

const CATEGORY_404 = "Category not found.";

const getAll = async (_, res) => {
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

const update = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new NotFound(CATEGORY_404);

  const data = await category.update(req.body);
  if (!data) throw new InternalServerError();

  res.status(200).send(data);
};

const remove = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new NotFound(CATEGORY_404);

  await category.delete();
  res.status(200).send({ message: "Successfully deleted category." });
};

const toggleStatus = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new NotFound(CATEGORY_404);

  await category.toggleStatus();
  res.status(200).send({ message: "Successfully changed category status." });
};

module.exports = {
  getAll,
  create,
  update,
  remove,
  toggleStatus,
};
