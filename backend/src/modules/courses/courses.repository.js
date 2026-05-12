const supabase = require('../../config/supabase');

// ---------- Electivas ----------

async function listElectives() {
  return supabase
    .from('elective_courses')
    .select('*')
    .eq('active', true)
    .order('name');
}

async function getElectiveById(id) {
  return supabase
    .from('elective_courses')
    .select('*')
    .eq('id', id)
    .eq('active', true)
    .maybeSingle();
}

async function insertElective(payload) {
  return supabase
    .from('elective_courses')
    .insert(payload)
    .select()
    .single();
}

async function updateElective(id, updates) {
  return supabase
    .from('elective_courses')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
}

async function softDeleteElective(id) {
  return supabase
    .from('elective_courses')
    .update({ active: false, deleted_at: new Date().toISOString() })
    .eq('id', id);
}

async function findOfferingsByElective(electiveId) {
  return supabase
    .from('course_offerings')
    .select('id')
    .eq('elective_course_id', electiveId)
    .eq('active', true);
}

async function findActiveEnrollmentsByOfferings(offeringIds) {
  return supabase
    .from('enrollments')
    .select('id')
    .in('course_offering_id', offeringIds)
    .eq('status', 'inscrito')
    .limit(1);
}

// ---------- Ofertas ----------

async function listOfferings() {
  return supabase
    .from('course_offerings')
    .select(`
      *,
      elective_courses(id, name, description, credits, modality),
      academic_programs(id, name),
      academic_periods(id, year, period),
      teacher:users!teacher_id(id, first_name, last_name)
    `)
    .eq('active', true)
    .order('id');
}

async function getOfferingById(id) {
  return supabase
    .from('course_offerings')
    .select('id, available_spots')
    .eq('id', id)
    .eq('active', true)
    .maybeSingle();
}

async function insertOffering(payload) {
  return supabase
    .from('course_offerings')
    .insert(payload)
    .select()
    .single();
}

async function updateOffering(id, updates) {
  return supabase
    .from('course_offerings')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
}

async function softDeleteOffering(id) {
  return supabase
    .from('course_offerings')
    .update({ active: false, deleted_at: new Date().toISOString() })
    .eq('id', id);
}

async function findActiveEnrollmentsByOffering(offeringId) {
  return supabase
    .from('enrollments')
    .select('id')
    .eq('course_offering_id', offeringId)
    .eq('status', 'inscrito')
    .limit(1);
}

async function countActiveEnrollments() {
  return supabase
    .from('enrollments')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'inscrito');
}

module.exports = {
  listElectives, getElectiveById, insertElective, updateElective, softDeleteElective,
  findOfferingsByElective, findActiveEnrollmentsByOfferings,
  listOfferings, getOfferingById, insertOffering, updateOffering, softDeleteOffering,
  findActiveEnrollmentsByOffering, countActiveEnrollments,
};
