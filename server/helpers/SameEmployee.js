const Employee = require("../src/models/employee.model");
const { owner } = require("../src/providers/permissions");

async function sameRoleAndNotOwner(req, auth) {
    const emp = await Employee.findById(req.params.id);
    if(!emp) return false; // false is returned since the user does not exist anyways so it's just gonna return a 404
  
    return emp.role === auth.role && !owner(req, auth);
}

module.exports = sameRoleAndNotOwner;