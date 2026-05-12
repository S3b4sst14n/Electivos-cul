const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../../config/env');
const ApiError = require('../../utils/ApiError');
const repo = require('./auth.repository');

async function register(payload) {
  if (await repo.findUserByEmail(payload.email)) {
    throw ApiError.conflict('El correo ya está registrado');
  }
  if (await repo.findUserByIdentification(payload.identification_number)) {
    throw ApiError.conflict('El número de identificación ya está registrado');
  }
  if (!(await repo.findActiveRole(payload.role_id))) {
    throw ApiError.badRequest('Rol inválido');
  }

  const hash = await bcrypt.hash(payload.password, 10);
  const { data, error } = await repo.createUser({ ...payload, password: hash });

  if (error) throw ApiError.internal('Error al registrar usuario');
  return data;
}

async function login(identification_number, password) {
  const { data: user, error } = await repo.findActiveUserByIdentification(identification_number);
  if (error || !user) throw ApiError.unauthorized('Credenciales inválidas');

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw ApiError.unauthorized('Credenciales inválidas');

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role_id: user.role_id,
      role_name: user.roles.name,
    },
    env.jwt.secret,
    { expiresIn: env.jwt.expiresIn }
  );

  return {
    token,
    usuario: {
      id: user.id,
      nombre: `${user.first_name} ${user.last_name}`,
      email: user.email,
      identification_number: user.identification_number,
      rol: user.roles.name,
    },
  };
}

module.exports = { register, login };
