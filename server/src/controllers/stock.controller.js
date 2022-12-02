const { BadRequest, InternalServerError, NotFound } = require("../../helpers/errors");
const Stock = require("../models/stock.model");

const findAll = async (req, res) => {
  const data = await Stock.findAll();
  if (!data) throw new InternalServerError();

  res.status(200).send(data);
}

const edit = async (req, res) => {
  const stock = await Stock.findById(req.params.id);
  console.log(stock);
  if (!stock) throw new NotFound();

  const data = await stock.edit(req.body);
  if (!data) throw new InternalServerError();

  res.status(200).send(data);
}

const create = async (req, res) => {
  const stock = new Stock(req.body);

  const data = await stock.save();
  if (!data) throw new InternalServerError();

  res.status(200).send(data);
};

module.exports = {
  findAll,
  edit,
  create
};