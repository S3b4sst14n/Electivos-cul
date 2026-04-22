require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const identification_number = process.argv[2];
const password = process.argv[3];

if (!identification_number || !password) {
  console.error('Uso: node scripts/debug-login.js <numero_identificacion> <contraseña>');
  process.exit(1);
}

async function debug() {
  console.log('\n--- Buscando usuario ---');
  console.log('identification_number:', identification_number);

  // Paso 1: buscar sin filtro active
  const { data: sinFiltro, error: e1 } = await supabase
    .from('users')
    .select('id, identification_number, email, active, password, role_id')
    .eq('identification_number', identification_number)
    .single();

  if (e1 || !sinFiltro) {
    console.log('❌ Usuario NO encontrado con ese número de identificación');
    console.log('   Error:', e1?.message);
    return;
  }

  console.log('✅ Usuario encontrado:');
  console.log('   ID:', sinFiltro.id);
  console.log('   Email:', sinFiltro.email);
  console.log('   active:', sinFiltro.active);
  console.log('   role_id:', sinFiltro.role_id);
  console.log('   password almacenada:', sinFiltro.password);

  // Paso 2: verificar campo active
  if (!sinFiltro.active) {
    console.log('\n❌ El campo "active" es false o null — el login lo rechaza');
    console.log('   Solución: ve a Supabase y ponlo en true');
  } else {
    console.log('\n✅ Campo active = true');
  }

  // Paso 3: verificar contraseña
  console.log('\n--- Verificando contraseña ---');
  const esHash = sinFiltro.password?.startsWith('$2');
  if (!esHash) {
    console.log('❌ La contraseña NO está hasheada con bcrypt (texto plano detectado)');
    console.log('   Valor actual:', sinFiltro.password);
    const hash = await bcrypt.hash(password, 10);
    console.log('\n   Hash generado para "' + password + '":');
    console.log('   ' + hash);
    console.log('\n   Copia ese hash en la columna password de este usuario en Supabase');
    return;
  }

  const valida = await bcrypt.compare(password, sinFiltro.password);
  if (valida) {
    console.log('✅ Contraseña correcta');
  } else {
    console.log('❌ Contraseña incorrecta — el hash no coincide con lo que escribiste');
    console.log('   Genera un nuevo hash con: node scripts/hash-password.js <contraseña>');
  }

  // Paso 4: verificar rol
  console.log('\n--- Verificando rol ---');
  const { data: rol } = await supabase
    .from('roles')
    .select('id, name')
    .eq('id', sinFiltro.role_id)
    .single();

  if (!rol) {
    console.log('❌ No se encontró el rol con id:', sinFiltro.role_id);
  } else {
    console.log('✅ Rol:', rol.name, '(id:', rol.id + ')');
  }
}

debug().catch(console.error);
