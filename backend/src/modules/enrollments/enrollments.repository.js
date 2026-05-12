const supabase = require('../../config/supabase');

async function getOfferingWithCourse(offeringId) {
  return supabase
    .from('course_offerings')
    .select('*, elective_courses(name)')
    .eq('id', offeringId)
    .eq('active', true)
    .maybeSingle();
}

async function findActiveEnrollment(studentId, offeringId) {
  const { data } = await supabase
    .from('enrollments')
    .select('id')
    .eq('student_id', studentId)
    .eq('course_offering_id', offeringId)
    .eq('status', 'inscrito')
    .maybeSingle();
  return data;
}

async function insertEnrollment(payload) {
  return supabase
    .from('enrollments')
    .insert(payload)
    .select()
    .single();
}

async function updateOfferingSpots(offeringId, spots) {
  return supabase
    .from('course_offerings')
    .update({ available_spots: spots, updated_at: new Date().toISOString() })
    .eq('id', offeringId);
}

async function getEnrollmentWithOffering(id) {
  return supabase
    .from('enrollments')
    .select('*, course_offerings(available_spots)')
    .eq('id', id)
    .maybeSingle();
}

async function cancelEnrollment(id) {
  return supabase
    .from('enrollments')
    .update({
      status: 'cancelado',
      cancelled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);
}

async function getOfferingBasic(offeringId) {
  return supabase
    .from('course_offerings')
    .select('id, elective_courses(name)')
    .eq('id', offeringId)
    .maybeSingle();
}

async function listEnrollmentsByOffering(offeringId) {
  return supabase
    .from('enrollments')
    .select(`
      id, status, enrolled_at, final_grade,
      student:users!student_id(id, first_name, last_name, second_last_name, identification_number, email)
    `)
    .eq('course_offering_id', offeringId)
    .eq('status', 'inscrito');
}

async function listEnrollmentsByStudent(studentId) {
  return supabase
    .from('enrollments')
    .select(`
      id, status, enrolled_at, final_grade,
      course_offerings(
        id, schedule, classroom, available_spots,
        elective_courses(name, description, credits, modality),
        academic_periods(year, period),
        teacher:users!teacher_id(first_name, last_name)
      )
    `)
    .eq('student_id', studentId)
    .eq('status', 'inscrito')
    .order('enrolled_at', { ascending: false });
}

module.exports = {
  getOfferingWithCourse, findActiveEnrollment, insertEnrollment, updateOfferingSpots,
  getEnrollmentWithOffering, cancelEnrollment,
  getOfferingBasic, listEnrollmentsByOffering, listEnrollmentsByStudent,
};
