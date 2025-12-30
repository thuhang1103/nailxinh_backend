const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
function authenticateJWT(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Missing token' });

  const token = authHeader.split(' ')[1];
  console.log('token:', token);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    console.log('payload:', payload);
    next();
  } catch (err) {
      console.log('lỗi authenticate', err);
    return res.status(401).json({ message: 'Invalid token' });
  }
}

function authorizeRoles(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (!allowedRoles.includes(req.user.Role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
}

module.exports = { authenticateJWT, authorizeRoles };