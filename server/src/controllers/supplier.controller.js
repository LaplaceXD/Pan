const { BadRequest, InternalServerError } = require("../../helpers/errors");
const Supplier = require("../models/supplier.model");

const view = async (_, res) => {
  const data = await Supplier.view();

  if (!data) throw new InternalServerError();

  res.status(200).send(data);
}

const create = async (req, res) => {
  const { error: validationError } = Supplier.validate(req.body);
  if (validationError) 
    throw new BadRequest(
      validationError.details.map((e) => ({ label: e.context.label, message: e.message }))
    );

  const supplier = new Supplier(req.body);
  const data = await supplier.save();
  
  if (!data) throw new InternalServerError();

  res.status(200).send(data);
};

const edit = async (req, res) => {
  const { error: validationError } = Supplier.validate(req.body);
  console.log(validationError.details);
  if (validationError) 

    throw new BadRequest(
      validationError.details.map((e) => ({ label: e.context.label, message: e.message }))
    );



  const supplier = new Supplier(req.body);
  await supplier.getId(req.params["id"]);

  const data = await supplier.edit();
  
  if (!data) throw new InternalServerError();

  res.status(200).send(data);
};

const toggleStatus = async (req, res) => {
  
  const supplier = await supplier.getId(req.params["id"]);

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