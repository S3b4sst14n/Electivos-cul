const supabase = require('../../config/supabase');

async function findUserByEmail(email) {
  const { data } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .maybeSingle();
  return data;
}

async function findUserByIdentification(identification_number) {
  const { data } = await supabase
    .from('users')
    .select('id')
    .eq('identification_number', identification_number)
    .maybeSingle();
  return data;
}

async function findActiveUserByIdentification(identification_number) {
  const { data, error } = await supabase
    .from('users')
    .select('*, roles(name)')
    .eq('identification_number', identification_number)
    .eq('active', true)
    .maybeSingle();
  return { data, error };
}

async function findActiveRole(role_id) {
  const { data } = await supabase
    .from('roles')
    .select('id')
    .eq('id', role_id)
    .eq('active', true)
    .maybeSingle();
  return data;
}

async function createUser(user) {
  const { data, error } = await supabase
    .from('users')
    .insert(user)
    .select('id, first_name, last_name, email, identification_number, role_id')
    .single();
  return { data, error };
}

module.exports = {
  findUserByEmail,
  findUserByIdentification,
  findActiveUserByIdentification,
  findActiveRole,
  createUser,
};
