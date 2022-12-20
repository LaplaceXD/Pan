const crypto = require("crypto");

const { InternalServerError, NotFound, BadRequest } = require("../../helpers/errors");
const { hash } = require("../providers");
const Employee = require("../models/employee.model");

const sendgridMailer = require('@sendgrid/mail');
const { markAsUntransferable } = require("worker_threads");
sendgridMailer.setApiKey(process.env.SENDGRID_API_KEY);

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

  // TODO: Email this instead of returning it
  data.password = password;
  res.status(200).send(data);
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

  // const isCurrentCorrect = await hash.compare(req.body.current_password, employee.password);
  // if (!isCurrentCorrect) throw new BadRequest({ current_password: "Current password does not match." });

  employee.password = await hash.hashPassword(req.body.new_password);
  await employee.savePassword();

  const msg = {
    to: employee.email, // Change to your recipient
    from: 'pan.project.2104@gmail.com', // Change to your verified sender
    subject: 'Password Reset',
    html: `<p> Good day, this email is to let you know that your password has been recently changed.</p>
           <p>Here is your new password:</p>
           <h1>` + req.body.new_password + `</h1>
           <p> If you did not authorize this change, please consult your manager </p>`
    
  }
  sendgridMailer
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })

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

  res.status(200).send({
    message: "Successfully reset password.",

    // TODO: This should be emailed to the user
    password,
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
