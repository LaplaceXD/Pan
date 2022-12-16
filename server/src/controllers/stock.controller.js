const { InternalServerError, NotFound } = require("../../helpers/errors");
const Stock = require("../models/stock.model");

const getAll = async (_, res) => {
  const data = await Stock.findAll();
  if (!data) throw new InternalServerError();

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
  if (!stock) throw new NotFound("Stock not found.");

  const data = await stock.update(req.body);
  if (!data) throw new InternalServerError();

  res.status(200).send(data);
};

module.exports = {
  getAll,
  create,
  update,
};
