function owner(req, auth) {
  return parseInt(req.params.id) === auth.id;
}

function roles(...roleList) {
  return (_, auth) => roleList.includes(auth.role);
}

module.exports = {
  roles,
  owner,
};
