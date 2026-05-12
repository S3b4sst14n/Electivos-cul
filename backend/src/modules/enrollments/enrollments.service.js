const ApiError = require('../../utils/ApiError');
const repo = require('./enrollments.repository');

async function enroll(studentId, offeringId) {
  const { data: offering, error } = await repo.getOfferingWithCourse(offeringId);
  if (error || !offering) throw ApiError.notFound('Oferta de curso no encontrada');

  if (offering.available_spots <= 0) {
    throw ApiError.conflict('No hay cupos disponibles en este curso');
  }

  if (await repo.findActiveEnrollment(studentId, offeringId)) {
    throw ApiError.conflict('Ya estás inscrito en esta oferta de curso');
  }

  const { data: enrollment, error: enrollErr } = await repo.insertEnrollment({
    course_offering_id: offeringId,
    student_id: studentId,
    status: 'inscrito',
  });
  if (enrollErr) throw ApiError.internal('Error al registrar inscripción');

  const nuevosSpots = offering.available_spots - 1;
  const { error: updateErr } = await repo.updateOfferingSpots(offeringId, nuevosSpots);
  if (updateErr) throw ApiError.internal('Error al actualizar cupos disponibles');

  return { enrollment, cupos_restantes: nuevosSpots };
}

async function cancel(studentId, enrollmentId) {
  const { data: enrollment, error } = await repo.getEnrollmentWithOffering(enrollmentId);
  if (error || !enrollment) throw ApiError.notFound('Inscripción no encontrada');

  if (enrollment.student_id !== studentId) {
    throw ApiError.forbidden('No tienes permiso para cancelar esta inscripción');
  }
  if (enrollment.status !== 'inscrito') {
    throw ApiError.badRequest('Solo se pueden cancelar inscripciones con estado "inscrito"');
  }

  const { error: cancelErr } = await repo.cancelEnrollment(enrollmentId);
  if (cancelErr) throw ApiError.internal('Error al cancelar inscripción');

  await repo.updateOfferingSpots(
    enrollment.course_offering_id,
    enrollment.course_offerings.available_spots + 1
  );
}

async function getByOffering(offeringId, orden) {
  const { data: offering } = await repo.getOfferingBasic(offeringId);
  if (!offering) throw ApiError.notFound('Oferta de curso no encontrada');

  const { data, error } = await repo.listEnrollmentsByOffering(offeringId);
  if (error) throw ApiError.internal('Error al obtener inscripciones');

  const sorted = data.sort((a, b) => {
    if (orden === 'identificacion') {
      return a.student.identification_number.localeCompare(b.student.identification_number);
    }
    const nameA = `${a.student.last_name} ${a.student.first_name}`;
    const nameB = `${b.student.last_name} ${b.student.first_name}`;
    return nameA.localeCompare(nameB);
  });

  return {
    curso: offering.elective_courses?.name,
    offering_id: offeringId,
    total_inscritos: sorted.length,
    estudiantes: sorted,
  };
}

async function getMine(studentId) {
  const { data, error } = await repo.listEnrollmentsByStudent(studentId);
  if (error) throw ApiError.internal('Error al obtener tus inscripciones');
  return { total: data.length, inscripciones: data };
}

module.exports = { enroll, cancel, getByOffering, getMine };
