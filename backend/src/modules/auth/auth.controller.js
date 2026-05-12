const service = require('./auth.service');

async function register(req, res) {
  const usuario = await service.register(req.body);
  res.status(201).json({ mensaje: 'Usuario registrado exitosamente', usuario });
}

async function login(req, res) {
  const { identification_number, password } = req.body;
  const result = await service.login(identification_number, password);
  res.json({ mensaje: 'Autenticación exitosa', ...result });
}

module.exports = { register, login };
