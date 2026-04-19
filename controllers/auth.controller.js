const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

async function register(req, res) {
  const {
    first_name, second_name, last_name, second_last_name,
    phone, email, identification_type_id, identification_number,
    password, role_id
  } = req.body;

  if (!first_name || !last_name || !second_last_name || !phone || !email ||
      !identification_type_id || !identification_number || !password || !role_id) {
    return res.status(400).json({ error: 'Todos los campos obligatorios deben estar presentes' });
  }

  const { data: existingEmail } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (existingEmail) {
    return res.status(400).json({ error: 'El correo ya está registrado' });
  }

  const { data: existingId } = await supabase
    .from('users')
    .select('id')
    .eq('identification_number', identification_number)
    .single();

  if (existingId) {
    return res.status(400).json({ error: 'El número de identificación ya está registrado' });
  }

  const { data: role } = await supabase
    .from('roles')
    .select('id')
    .eq('id', role_id)
    .eq('active', true)
    .single();

  if (!role) {
    return res.status(400).json({ error: 'Rol inválido' });
  }

  const hash = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from('users')
    .insert({
      first_name, second_name, last_name, second_last_name,
      phone, email, identification_type_id, identification_number,
      password: hash, role_id
    })
    .select('id, first_name, last_name, email, identification_number, role_id')
    .single();

  if (error) return res.status(500).json({ error: 'Error al registrar usuario' });

  return res.status(201).json({ mensaje: 'Usuario registrado exitosamente', usuario: data });
}

async function login(req, res) {
  const { identification_number, password } = req.body;

  if (!identification_number || !password) {
    return res.status(400).json({ error: 'Número de identificación y contraseña son obligatorios' });
  }

  const { data: usuario, error } = await supabase
    .from('users')
    .select('*, roles(name)')
    .eq('identification_number', identification_number)
    .eq('active', true)
    .single();

  if (error || !usuario) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const passwordValida = await bcrypt.compare(password, usuario.password);
  if (!passwordValida) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const token = jwt.sign(
    {
      id: usuario.id,
      email: usuario.email,
      role_id: usuario.role_id,
      role_name: usuario.roles.name
    },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  return res.json({
    mensaje: 'Autenticación exitosa',
    token,
    usuario: {
      id: usuario.id,
      nombre: `${usuario.first_name} ${usuario.last_name}`,
      email: usuario.email,
      identification_number: usuario.identification_number,
      rol: usuario.roles.name
    }
  });
}

module.exports = { register, login };
