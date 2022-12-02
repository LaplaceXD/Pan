const { BadRequest, InternalServerError, NotFound } = require("../../helpers/errors");
const Order = require("../models/order.model");

const view = async (_, res) => {
    const data = await Order.view();
    if (!data) throw new InternalServerError();
  
    res.status(200).send(data);
  }

const create = async (req, res) => {
  const order = new Order(req.body);

  const data = await product.create();
  if (!data) throw new InternalServerError();

  res.status(200).send(data);
};

const toggleStatus = async (req, res) => {  

  const product = await Product.findById(req.params.id);
  if (!product) throw new NotFound("Product not Found");
  
  await product.toggleStatus();

  res.status(200).send({ 
    error:false, 
    status:200, 
    message:"Successfully changed product status."});
}

module.exports = {
  view,
  create,
  toggleStatus,
};