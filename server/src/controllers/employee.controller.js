const { BadRequest, InternalServerError, NotFound } = require("../../helpers/errors");
const { hash } = require("../providers");
const Employee = require("../models/employee.model");
const generator = require('generate-password');

const create = async (req, res) => {
  const { error: validationError } = Employee.validate(req.body);
  if (validationError)
    throw new BadRequest(
      validationError.details.map((e) => ({ label: e.context.label, message: e.message }))
    );

    const generated_pass = generator.generate({
      length: 10,
      numbers: true,
      symbols: true
    })

  const employee = new Employee(req.body);
  employee.password = await hash.hashPassword(generated_pass);

  const data = await employee.create();
  if (!data) throw new InternalServerError();

  data.password = generated_pass;
  res.status(200).send(data);
};

const edit = async (req, res) => {
  const { error: validationError } = Employee.validate(req.body);
  if (validationError)
    throw new BadRequest(
      validationError.details.map((e) => ({ label: e.context.label, message: e.message }))
    );

  const employee = await Employee.findById(req.params.id);
  if (!employee) throw new NotFound();

  const {password, ...data} = await employee.edit(req.body);
  if (!data) throw new InternalServerError();

  res.status(200).send(data);
}

const reset = async (req, res) => {  
  const employee = await Employee.findById(req.params.id);
  if (!employee) throw new NotFound();

  const generated_pass = generator.generate({
    length: 10,
    numbers: true,
    symbols: true
  })
  
  new_pass = await hash.hashPassword(generated_pass);
  
  employee.deactivate();

  const data = await employee.reset();
  if (!data) throw new InternalServerError();

  res.status(200).send({ 
    error:false, 
    status:200, 
    message:"Successfully reset password.", 
    new_password:generated_pass });
}

const deactivate = async (req, res) => {
  const { error: validationError } = Employee.validateID(req.body);
  if (validationError)
    throw new BadRequest(
      validationError.details.map((e) => ({ label: e.context.label, message: e.message }))
    );

  const employee = new Employee(req.body);
  const data = employee.deactivate();

  if (!data) throw new InternalServerError();

  res.status(200).send({ 
    error:false, 
    status:200, 
    message:"Successfully deactivated employee account."});
}

module.exports = {
  create,
  edit,
  reset,
  deactivate,
};