const { BadRequest, InternalServerError, NotFound } = require("../../helpers/errors");
const Product = require("../models/product.model");

const view = async (_, res) => {
    const data = await Product.view();
    if (!data) throw new InternalServerError();
  
    res.status(200).send(data);
  }

const create = async (req, res) => {
  const product = new Product(req.body);

  const data = await product.create();
  if (!data) throw new InternalServerError();

  res.status(200).send(data);
};

// const edit = async (req, res) => {

//   const employee = await Employee.findById(req.params.id);
//   if (!employee) throw new NotFound();

//   const {password, ...data} = await employee.edit(req.body);
//   if (!data) throw new InternalServerError();

//   res.status(200).send(data);
// }

// const reset = async (req, res) => {  

//   const employee = await Employee.findById(req.params.id);
//   if (!employee) throw new NotFound();

//   const generated_pass = crypto.randomBytes(8).toString("base64").replace("==", "");
  
//   new_pass = await hash.hashPassword(generated_pass);
//   employee.password = new_pass;
  
//   const data = await employee.reset();

//   if (!data) throw new InternalServerError();

//   res.status(200).send({ 
//     error:false, 
//     status:200, 
//     message:"Successfully reset password.", 
//     new_password:generated_pass });
// }

// const toggleStatus = async (req, res) => {

  
//   const employee = await Employee.findById(req.params.id);
//   if (!employee) throw new NotFound("Employee not Found");
  
//   await employee.toggleStatus();

//   res.status(200).send({ 
//     error:false, 
//     status:200, 
//     message:"Successfully changed employee status."});
// }

module.exports = {
  view,
  create,
//   edit,
//   reset,
//   toggleStatus,
};