// src/services/token.service.js
const jwt = require('jsonwebtoken');

function signRegistrationToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.REG_TOKEN_EXP || '10m' });
}
function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
function signAuthToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.AUTH_TOKEN_EXP || '15m' });
}
function signAuthRefreshToken(payload) {
  return jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.AUTH_REFRESH_TOKEN_EXP || '7d' }
  );
}
module.exports = { signRegistrationToken, verifyToken, signAuthToken, signAuthRefreshToken };