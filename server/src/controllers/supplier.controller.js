const { BadRequest, InternalServerError } = require("../../helpers/errors");
const Supplier = require("../models/supplier.model");

const view = async (_, res) => {
  const data = await Supplier.view();

  if (!data) throw new InternalServerError();

  res.status(200).send(data);
}

const create = async (req, res) => {

  const supplier = new Supplier(req.body);
  const data = await supplier.save();
  
  if (!data) throw new InternalServerError();

  res.status(200).send(data);
};

const edit = async (req, res) => {
  
  const supplier = await Supplier.findById(req.params.id);
  if (!supplier) throw new NotFound();

  console.log(supplier);

  const data = await supplier.edit(req.body);
  if (!data) throw new InternalServerError();

  res.status(200).send(data);
};

const toggleStatus = async (req, res) => {
  
  const supplier = await Supplier.findById(req.params["id"]);
  if (!supplier) throw new BadRequest();

  await supplier.toggleStatus();

  res.status(200).send({
    "error": false,
    "status": 200,
    "message": "Successfully changed supplier status"
  });

  
};

module.exports = {
    view,
    create,
    edit,
    toggleStatus,
}