const service = require('./enrollments.service');

async function enroll(req, res) {
  const { enrollment, cupos_restantes } = await service.enroll(req.user.id, req.body.course_offering_id);
  res.status(201).json({
    mensaje: 'Inscripción registrada exitosamente',
    inscripcion: enrollment,
    cupos_restantes,
  });
}

async function cancelEnrollment(req, res) {
  await service.cancel(req.user.id, req.params.id);
  res.json({ mensaje: 'Inscripción cancelada exitosamente' });
}

async function getEnrollmentsByOffering(req, res) {
  res.json(await service.getByOffering(req.params.offering_id, req.query.orden));
}

async function getMyEnrollments(req, res) {
  res.json(await service.getMine(req.user.id));
}

module.exports = { enroll, cancelEnrollment, getEnrollmentsByOffering, getMyEnrollments };
