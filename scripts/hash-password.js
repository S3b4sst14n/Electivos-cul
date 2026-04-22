const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.error('Uso: node scripts/hash-password.js <contraseña>');
  process.exit(1);
}

bcrypt.hash(password, 10).then((hash) => {
  console.log('\nHash generado (copia esto en Supabase, columna password):');
  console.log(hash);
});
