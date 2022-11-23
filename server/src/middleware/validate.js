const { BadRequest } = require("../../helpers/errors");

const validate = (...validators) => {
  return async (req, _, next) => {
    const errors = {};

    for (const validator of validators) {
      let result = validator(req.body);
      if (result instanceof Promise) result = await result;

      const { error, value } = result;
      if (error) {
        // Extract errors if present and collate them inside errors object
        Object.assign(
          errors,
          error.details.reduce((obj, e) => ({ ...obj, [e.context.key]: e.message }), {})
        );
      } else {
        // store validated value in req.body
        Object.assign(req.body, value);
      }
    }

    // if entries are present in errors then throw a bad request
    if (Object.entries(errors).length !== 0) throw new BadRequest(errors);
    next();
  };
};

module.exports = validate;
