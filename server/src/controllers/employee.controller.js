const { BadRequest, InternalServerError, NotFound } = require("../../helpers/errors");
const { hash } = require("../providers");
const Employee = require("../models/employee.model");
const crypto = require("crypto");

const create = async (req, res) => {
  const generated_pass = crypto.randomBytes(8).toString("base64").replace("==", "");

  const employee = new Employee(req.body);
  employee.password = await hash.hashPassword(generated_pass);

  const data = await employee.create();
  if (!data) throw new InternalServerError();

  data.password = generated_pass;
  res.status(200).send(data);
};

const edit = async (req, res) => {

  const employee = await Employee.findById(req.params.id);
  if (!employee) throw new NotFound();

  const {password, ...data} = await employee.edit(req.body);
  if (!data) throw new InternalServerError();

  res.status(200).send(data);
}

const reset = async (req, res) => {  

  const employee = await Employee.findById(req.params.id);
  if (!employee) throw new NotFound();

  const generated_pass = crypto.randomBytes(8).toString("base64").replace("==", "");
  
  new_pass = await hash.hashPassword(generated_pass);
  employee.password = new_pass;
  
  const data = await employee.reset();

  if (!data) throw new InternalServerError();

  res.status(200).send({ 
    error:false, 
    status:200, 
    message:"Successfully reset password.", 
    new_password:generated_pass });
}

const toggleStatus = async (req, res) => {

  
  const employee = await Employee.findById(req.params.id);
  if (!employee) throw new NotFound("Employee not Found");
  
  await employee.toggleStatus();

  res.status(200).send({ 
    error:false, 
    status:200, 
    message:"Successfully changed employee status."});
}

module.exports = {
  create,
  edit,
  reset,
  toggleStatus,
};