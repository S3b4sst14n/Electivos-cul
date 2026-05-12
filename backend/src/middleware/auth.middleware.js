const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');

function verifyToken(req, _res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return next(ApiError.unauthorized('Token requerido'));

  try {
    req.user = jwt.verify(token, env.jwt.secret);
    next();
  } catch {
    next(ApiError.unauthorized('Token inválido o expirado'));
  }
}

function requireAdmin(req, _res, next) {
  if (req.user?.role_name?.toLowerCase() !== 'administrador') {
    return next(ApiError.forbidden('Acceso restringido a administradores'));
  }
  next();
}

module.exports = { verifyToken, requireAdmin };
