function validateCreateElective(req) {
  const { name, max_capacity, modality } = req.body;
  if (!name || !max_capacity || !modality) {
    return { error: 'Nombre, capacidad máxima y modalidad son obligatorios' };
  }
  return null;
}

function validateCreateOffering(req) {
  const required = [
    'elective_course_id', 'academic_program_id', 'academic_period_id',
    'teacher_id', 'schedule', 'available_spots',
  ];
  const missing = required.filter((f) => req.body[f] === undefined || req.body[f] === null || req.body[f] === '');
  if (missing.length > 0) {
    return { error: 'Todos los campos son obligatorios para crear una oferta', details: { missing } };
  }
  return null;
}

module.exports = { validateCreateElective, validateCreateOffering };
