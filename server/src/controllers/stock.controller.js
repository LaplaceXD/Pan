const { InternalServerError, NotFound } = require("../../helpers/errors");
const Stock = require("../models/stock.model");

const STOCK_404 = "Stock not found.";

const getAll = async (req, res) => {
  const { for: type, id } = req.query;
  let data = null;

  switch (type.toLowerCase()) {
    case "supplier":
      data = await Stock.findAllBySupplierId(id || 0);
      break;
    case "product":
      data = await Stock.findAllByProductId(id || 0);
      break;
    default:
      data = await Stock.findAll();
      break;
  }

  if (!data) throw new InternalServerError();
  res.status(200).send(data);
};

const getById = async (req, res) => {
  const data = await Stock.findById(req.params.id);
  if (!data) throw new NotFound(STOCK_404);

  res.status(200).send(data);
};

const create = async (req, res) => {
  const stock = new Stock(req.body);

  const data = await stock.save();
  if (!data) throw new InternalServerError();

  res.status(200).send(data);
};

const update = async (req, res) => {
  const stock = await Stock.findById(req.params.id);
  if (!stock) throw new NotFound(STOCK_404);

  const data = await stock.update(req.body);
  if (!data) throw new InternalServerError();

  res.status(200).send(data);
};

const remove = async (req, res) => {
  const stock = await Stock.findById(req.params.id);
  if (!stock) throw new NotFound(STOCK_404);

  await stock.delete();
  res.status(200).send({ message: "Successfully deleted stock." });
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
