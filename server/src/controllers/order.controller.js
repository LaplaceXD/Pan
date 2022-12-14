const { InternalServerError, NotFound, BadRequest } = require("../../helpers/errors");
const Order = require("../models/order.model");

const ORDER_404 = "Order not found.";

const getAll = async (_, res) => {
  const data = await Order.findAll();
  if (!data) throw new InternalServerError();

  res.status(200).send(data);
};

const getById = async (req, res) => {
  const data = await Order.findById(req.params.id);
  if (!data) throw new NotFound(ORDER_404);

  res.status(200).send(data);
};

const create = async (req, res) => {
  const employee = new Employee(req.body);

  const password = generatePassword();
  employee.password = await hash.hashPassword(password);

  const data = await employee.save();
  if (!data) throw new InternalServerError();

  // TODO: Email this instead of returning it
  data.password = password;
  res.status(200).send(data);
};

module.exports = {
  getAll,
  getById,
  create
};
