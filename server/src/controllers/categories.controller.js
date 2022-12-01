const { BadRequest, InternalServerError } = require("../../helpers/errors");
const Category = require("../models/categories.model");

const create = async (req, res) => {
  const { error: validationError } = Category.validate(req.body);
  if (validationError)
    throw new BadRequest(
      validationError.details.map((e) => ({ label: e.context.label, message: e.message }))
    );

  const category = new Category(req.body);

  const data = await category.save;
  if (!data) throw new InternalServerError();

  res.status(200).send(data);
};

module.exports = {
  create,
};
