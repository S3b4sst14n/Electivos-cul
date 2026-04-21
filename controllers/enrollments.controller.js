const supabase = require('../config/supabase');

async function enroll(req, res) {
  const { course_offering_id } = req.body;
  const student_id = req.user.id;

  if (!course_offering_id) {
    return res.status(400).json({ error: 'El ID de la oferta del curso es obligatorio' });
  }

  const { data: offering, error: offeringError } = await supabase
    .from('course_offerings')
    .select('*, elective_courses(name)')
    .eq('id', course_offering_id)
    .eq('active', true)
    .single();

  if (offeringError || !offering) {
    return res.status(404).json({ error: 'Oferta de curso no encontrada' });
  }

  if (offering.available_spots <= 0) {
    return res.status(400).json({ error: 'No hay cupos disponibles en este curso' });
  }

  const { data: existing } = await supabase
    .from('enrollments')
    .select('id')
    .eq('student_id', student_id)
    .eq('course_offering_id', course_offering_id)
    .eq('status', 'inscrito')
    .single();

  if (existing) {
    return res.status(400).json({ error: 'Ya estás inscrito en esta oferta de curso' });
  }

  const { data: enrollment, error: enrollError } = await supabase
    .from('enrollments')
    .insert({ course_offering_id, student_id, status: 'inscrito' })
    .select()
    .single();

  if (enrollError) return res.status(500).json({ error: 'Error al registrar inscripción' });

  const { error: updateError } = await supabase
    .from('course_offerings')
    .update({
      available_spots: offering.available_spots - 1,
      updated_at: new Date().toISOString()
    })
    .eq('id', course_offering_id);

  if (updateError) return res.status(500).json({ error: 'Error al actualizar cupos disponibles' });

  return res.status(201).json({
    mensaje: 'Inscripción registrada exitosamente',
    inscripcion: enrollment,
    cupos_restantes: offering.available_spots - 1
  });
}

async function cancelEnrollment(req, res) {
  const { id } = req.params;
  const student_id = req.user.id;

  const { data: enrollment, error: findError } = await supabase
    .from('enrollments')
    .select('*, course_offerings(available_spots)')
    .eq('id', id)
    .single();

  if (findError || !enrollment) {
    return res.status(404).json({ error: 'Inscripción no encontrada' });
  }

  if (enrollment.student_id !== student_id) {
    return res.status(403).json({ error: 'No tienes permiso para cancelar esta inscripción' });
  }

  if (enrollment.status !== 'inscrito') {
    return res.status(400).json({ error: 'Solo se pueden cancelar inscripciones con estado "inscrito"' });
  }

  const { error: cancelError } = await supabase
    .from('enrollments')
    .update({
      status: 'cancelado',
      cancelled_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (cancelError) return res.status(500).json({ error: 'Error al cancelar inscripción' });

  await supabase
    .from('course_offerings')
    .update({
      available_spots: enrollment.course_offerings.available_spots + 1,
      updated_at: new Date().toISOString()
    })
    .eq('id', enrollment.course_offering_id);

  return res.json({ mensaje: 'Inscripción cancelada exitosamente' });
}

async function getEnrollmentsByOffering(req, res) {
  const { offering_id } = req.params;
  const { orden } = req.query;

  const { data: offering } = await supabase
    .from('course_offerings')
    .select('id, elective_courses(name)')
    .eq('id', offering_id)
    .single();

  if (!offering) return res.status(404).json({ error: 'Oferta de curso no encontrada' });

  const { data, error } = await supabase
    .from('enrollments')
    .select(`
      id, status, enrolled_at, final_grade,
      student:users!student_id(id, first_name, last_name, second_last_name, identification_number, email)
    `)
    .eq('course_offering_id', offering_id)
    .eq('status', 'inscrito');

  if (error) return res.status(500).json({ error: 'Error al obtener inscripciones' });

  const sorted = data.sort((a, b) => {
    if (orden === 'identificacion') {
      return a.student.identification_number.localeCompare(b.student.identification_number);
    }
    const nameA = `${a.student.last_name} ${a.student.first_name}`;
    const nameB = `${b.student.last_name} ${b.student.first_name}`;
    return nameA.localeCompare(nameB);
  });

  return res.json({
    curso: offering.elective_courses?.name,
    offering_id,
    total_inscritos: sorted.length,
    estudiantes: sorted
  });
}

async function getMyEnrollments(req, res) {
  const student_id = req.user.id;

  const { data, error } = await supabase
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
    .eq('student_id', student_id)
    .eq('status', 'inscrito')
    .order('enrolled_at', { ascending: false });

  if (error) return res.status(500).json({ error: 'Error al obtener tus inscripciones' });

  return res.json({ total: data.length, inscripciones: data });
}

module.exports = { enroll, cancelEnrollment, getEnrollmentsByOffering, getMyEnrollments };
