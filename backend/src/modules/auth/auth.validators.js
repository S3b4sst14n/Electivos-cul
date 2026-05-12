const REGISTER_FIELDS = [
  'first_name', 'last_name', 'second_last_name', 'phone', 'email',
  'identification_type_id', 'identification_number', 'password', 'role_id',
];

function validateRegister(req) {
  const missing = REGISTER_FIELDS.filter((f) => !req.body[f]);
  if (missing.length > 0) {
    return { error: 'Todos los campos obligatorios deben estar presentes', details: { missing } };
  }
  return null;
}

function validateLogin(req) {
  const { identification_number, password } = req.body;
  if (!identification_number || !password) {
    return { error: 'Número de identificación y contraseña son obligatorios' };
  }
  return null;
}

module.exports = { validateRegister, validateLogin };
