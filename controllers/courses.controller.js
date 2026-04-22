const supabase = require('../config/supabase');

// --- Electivas (elective_courses) ---

async function getElectives(req, res) {
  const { data, error } = await supabase
    .from('elective_courses')
    .select('*')
    .eq('active', true)
    .order('name');

  if (error) return res.status(500).json({ error: 'Error al obtener electivas' });
  return res.json(data);
}

async function getElectiveById(req, res) {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('elective_courses')
    .select('*')
    .eq('id', id)
    .eq('active', true)
    .single();

  if (error || !data) return res.status(404).json({ error: 'Electiva no encontrada' });
  return res.json(data);
}

async function createElective(req, res) {
  const { name, description, credits, max_capacity, modality } = req.body;

  if (!name || !max_capacity || !modality) {
    return res.status(400).json({ error: 'Nombre, capacidad máxima y modalidad son obligatorios' });
  }

  const modalidades = ['presencial', 'virtual', 'mixta'];
  if (!modalidades.includes(modality)) {
    return res.status(400).json({ error: 'Modalidad inválida. Use: presencial, virtual o mixta' });
  }

  const { data, error } = await supabase
    .from('elective_courses')
    .insert({ name, description, credits: credits || 3, max_capacity, modality })
    .select()
    .single();

  if (error) return res.status(500).json({ error: 'Error al crear electiva' });
  return res.status(201).json({ mensaje: 'Electiva creada exitosamente', electiva: data });
}

async function updateElective(req, res) {
  const { id } = req.params;
  const { name, description, credits, max_capacity, modality } = req.body;

  const { data: existing } = await supabase
    .from('elective_courses')
    .select('id')
    .eq('id', id)
    .eq('active', true)
    .single();

  if (!existing) return res.status(404).json({ error: 'Electiva no encontrada' });

  const updates = {};
  if (name !== undefined) updates.name = name;
  if (description !== undefined) updates.description = description;
  if (credits !== undefined) updates.credits = credits;
  if (max_capacity !== undefined) updates.max_capacity = max_capacity;
  if (modality !== undefined) updates.modality = modality;
  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('elective_courses')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: 'Error al actualizar electiva' });
  return res.json({ mensaje: 'Electiva actualizada exitosamente', electiva: data });
}

async function deleteElective(req, res) {
  const { id } = req.params;

  const { data: offerings } = await supabase
    .from('course_offerings')
    .select('id')
    .eq('elective_course_id', id)
    .eq('active', true)
    .limit(1);

  if (offerings && offerings.length > 0) {
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('id')
      .in('course_offering_id', offerings.map(o => o.id))
      .eq('status', 'inscrito')
      .limit(1);

    if (enrollments && enrollments.length > 0) {
      return res.status(400).json({ error: 'No se puede eliminar una electiva con inscripciones activas' });
    }
  }

  const { error } = await supabase
    .from('elective_courses')
    .update({ active: false, deleted_at: new Date().toISOString() })
    .eq('id', id);

  if (error) return res.status(500).json({ error: 'Error al eliminar electiva' });
  return res.json({ mensaje: 'Electiva eliminada exitosamente' });
}

// --- Ofertas de cursos (course_offerings) ---

async function getOfferings(req, res) {
  const { data, error } = await supabase
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

  if (error) return res.status(500).json({ error: 'Error al obtener ofertas de cursos' });
  return res.json(data);
}

async function createOffering(req, res) {
  const {
    elective_course_id, academic_program_id, academic_period_id,
    teacher_id, schedule, classroom, available_spots
  } = req.body;

  if (!elective_course_id || !academic_program_id || !academic_period_id ||
      !teacher_id || !schedule || !available_spots) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios para crear una oferta' });
  }

  const { data, error } = await supabase
    .from('course_offerings')
    .insert({
      elective_course_id, academic_program_id, academic_period_id,
      teacher_id, schedule, classroom, available_spots
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: 'Error al crear oferta de curso' });
  return res.status(201).json({ mensaje: 'Oferta de curso creada exitosamente', oferta: data });
}

async function updateOffering(req, res) {
  const { id } = req.params;
  const { schedule, classroom, available_spots, teacher_id } = req.body;

  const { data: existing } = await supabase
    .from('course_offerings')
    .select('id, available_spots')
    .eq('id', id)
    .eq('active', true)
    .single();

  if (!existing) return res.status(404).json({ error: 'Oferta de curso no encontrada' });

  const updates = { updated_at: new Date().toISOString() };
  if (schedule !== undefined) updates.schedule = schedule;
  if (classroom !== undefined) updates.classroom = classroom;
  if (available_spots !== undefined) updates.available_spots = available_spots;
  if (teacher_id !== undefined) updates.teacher_id = teacher_id;

  const { data, error } = await supabase
    .from('course_offerings')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: 'Error al actualizar oferta de curso' });
  return res.json({ mensaje: 'Oferta actualizada exitosamente', oferta: data });
}

async function deleteOffering(req, res) {
  const { id } = req.params;

  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('id')
    .eq('course_offering_id', id)
    .eq('status', 'inscrito')
    .limit(1);

  if (enrollments && enrollments.length > 0) {
    return res.status(400).json({ error: 'No se puede eliminar una oferta con inscripciones activas' });
  }

  const { error } = await supabase
    .from('course_offerings')
    .update({ active: false, deleted_at: new Date().toISOString() })
    .eq('id', id);

  if (error) return res.status(500).json({ error: 'Error al eliminar oferta de curso' });
  return res.json({ mensaje: 'Oferta eliminada exitosamente' });
}

async function getAdminStats(req, res) {
  const { count, error } = await supabase
    .from('enrollments')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'inscrito');

  if (error) return res.status(500).json({ error: 'Error al obtener estadísticas' });
  return res.json({ inscritos: count });
}

module.exports = {
  getElectives, getElectiveById, createElective, updateElective, deleteElective,
  getOfferings, createOffering, updateOffering, deleteOffering, getAdminStats
};
