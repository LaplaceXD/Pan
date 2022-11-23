function roles(...roles) {
  return (_, auth) => {
    return roles.includes(auth.role);
  };
}

function owner(req, auth) {
  return req.params.id === auth.id;
}

function ownerIf(getCondition) {
  return async (req, auth) => {
    let condition = getCondition(req, auth);
    if (condition instanceof Promise) condition = await condition;

    // only check if owner if the condition is satisfied
    // else default to true
    return condition ? owner(req, auth) : true;
  };
}

module.exports = {
  roles,
  ownerIf,
  owner,
};
