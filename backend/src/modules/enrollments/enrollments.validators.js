function validateEnroll(req) {
  if (!req.body.course_offering_id) {
    return { error: 'El ID de la oferta del curso es obligatorio' };
  }
  return null;
}

module.exports = { validateEnroll };
