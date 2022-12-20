const { BadRequest } = require("../../helpers/errors");

const validate = (...validators) => {
  return async (req, _, next) => {
    const errors = await validators.reduce(async (errors, validator) => {
      const { error, value } = await validator(req.body, req.params, req.auth);

      if (error) {
        return {
          ...errors,
          ...error.details.reduce((obj, e) => ({ ...obj, [e.context.key]: e.message }), {}),
        };
      } else {
        req.body = Array.isArray(req.body) ? value : { ...req.body, ...value };
        return errors;
      }
    }, {});

    // if entries are present in errors then throw a bad request
    if (Object.entries(errors).length !== 0) throw new BadRequest(errors);
    next();
  };
};

module.exports = validate;
