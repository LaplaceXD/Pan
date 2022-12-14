const Employee = require("../models/employee.model");

function owner(req, auth) {
  return parseInt(req.params.id) === auth.id;
}

function roles(...roleList) {
  return (_, auth) => roleList.includes(auth.role);
}

async function sameRoleAndNotOwner(req, auth) {
  const emp = await Employee.findById(req.params.id);
  // false is returned since the user does not exist anyways so it's just gonna return a 404
  if (!emp) return false;

  return emp.role === auth.role && !owner(req, auth);
}

module.exports = {
  roles,
  owner,
  sameRoleAndNotOwner,
};
