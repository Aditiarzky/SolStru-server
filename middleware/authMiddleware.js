const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET;

const AuthenticateToken = (req, res, next) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ success: false, message: "Forbidden, invalid token" });
  }
};

module.exports = AuthenticateToken;