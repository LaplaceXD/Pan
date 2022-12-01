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

const edit = async (req, res) => {

  const product = await Product.findById(req.params.id);
  if (!product) throw new NotFound();

  const data = await product.edit(req.body);
  if (!data) throw new InternalServerError();

  res.status(200).send(data);
}

const remove = async (req, res) => {
    
    const product = await Product.findById(req.params.id);
    if (!product) throw new NotFound();

    await product.delete();

    res.status(200).send({ 
        error:false, 
        status:200, 
        message:"Successfully deleted product."});
}

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
  edit,
  remove,
  toggleStatus,
};