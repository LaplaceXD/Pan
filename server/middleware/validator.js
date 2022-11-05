function validator(validateCb) {
  return (req, _, next) => {
    const { error } = validateCb(req.body);
    if (error) throw new Error(error.details.map(({ message }) => message));

    next();
  };
}

module.exports = validator;
