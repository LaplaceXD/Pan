const crypto = require("crypto");

const { InternalServerError, NotFound, BadRequest } = require("../../helpers/errors");
const { hash } = require("../providers");
const Employee = require("../models/employee.model");

const Mailer = require("../providers/mail");

function generatePassword() {
  return crypto.randomBytes(8).toString("base64").replaceAll("=", "");
}

const EMPLOYEE_404 = "Employee not found.";

const getAll = async (_, res) => {
  const data = await Employee.findAll();
  if (!data) throw new InternalServerError();

  res.status(200).send(data.map(({ password, ...d }) => d));
};

const getById = async (req, res) => {
  const data = await Employee.findById(req.params.id);
  if (!data) throw new NotFound(EMPLOYEE_404);

  const { password, ...filteredData } = data;
  res.status(200).send(filteredData);
};

const create = async (req, res) => {
  const employee = new Employee(req.body);

  const password = generatePassword();
  employee.password = await hash.hashPassword(password);

  const data = await employee.save();
  if (!data) throw new InternalServerError();

  Mailer.create({ email: employee.email, password: password })

  res.status(200).send({
    message: "Account successfully created.",
    data: req.body
  });
};

const update = async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) throw new NotFound(EMPLOYEE_404);

  const data = await employee.update(req.body);
  if (!data) throw new InternalServerError();

  const { password, ...filteredData } = data;
  res.status(200).send(filteredData);
};

const changePassword = async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) throw new NotFound(EMPLOYEE_404);

  const isCurrentCorrect = await hash.compare(req.body.current_password, employee.password);
  if (!isCurrentCorrect) throw new BadRequest({ current_password: "Current password does not match." });

  employee.password = await hash.hashPassword(req.body.new_password);
  await employee.savePassword();

  Mailer.change({ email: employee.email, password: req.body.new_password });

  res.status(200).send({
    message: "Successfully changed password.",
  });
};

const resetPassword = async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) throw new NotFound(EMPLOYEE_404);

  const password = generatePassword();
  employee.password = await hash.hashPassword(password);
  await employee.savePassword();

  Mailer.reset({ email: employee.email, password: password });

  res.status(200).send({
    message: "Successfully reset password."
  });
};

const toggleStatus = async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) throw new NotFound(EMPLOYEE_404);

  await employee.toggleStatus();

  res.status(200).send({
    message: "Successfully toggled employee status.",
  });
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  changePassword,
  resetPassword,
  toggleStatus,
};
