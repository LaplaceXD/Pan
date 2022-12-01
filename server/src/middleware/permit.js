const { Prohibited } = require("../../helpers/errors");

const permit = ({ allow = [], deny = [] }) => {
  return async (req, _, next) => {
    const allowList = allow.map((fn) => fn(req, req.auth));
    const denyList = deny.map((fn) => fn(req, req.auth));
    const [allowResults, denyResults] = await Promise.all([Promise.all(allowList), Promise.all(denyList)]);

    const isAllowed = allowResults.some((v) => v);
    const isDenied = denyResults.some((v) => v);

    // It takes one deny or no allows to prohibit user from access
    if (isDenied || !isAllowed) throw new Prohibited();

    next();
  };
};

module.exports = permit;
