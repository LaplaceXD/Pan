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
    let condition = await getCondition(req, auth);

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
