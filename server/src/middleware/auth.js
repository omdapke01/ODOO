const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/env");

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required." });
  }

  const token = authHeader.split(" ")[1];

  try {
    req.user = jwt.verify(token, jwtSecret);
    return next();
  } catch (_error) {
    return res.status(401).json({ message: "Invalid token." });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden." });
    }

    return next();
  };
}

module.exports = { requireAuth, requireRole };
