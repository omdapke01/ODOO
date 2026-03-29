const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/env");

function signToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
      companyId: user.companyId,
      name: user.name,
      email: user.email,
    },
    jwtSecret,
    { expiresIn: "7d" }
  );
}

module.exports = { signToken };
