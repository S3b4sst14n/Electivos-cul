const ApiError = require('../../utils/ApiError');
const repo = require('./courses.repository');

const MODALITIES = ['presencial', 'virtual', 'mixta'];

// ---------- Electivas ----------

async function listElectives() {
  const { data, error } = await repo.listElectives();
  if (error) throw ApiError.internal('Error al obtener electivas');
  return data;
}

async function getElectiveById(id) {
  const { data } = await repo.getElectiveById(id);
  if (!data) throw ApiError.notFound('Electiva no encontrada');
  return data;
}

async function createElective(payload) {
  if (!MODALITIES.includes(payload.modality)) {
    throw ApiError.badRequest('Modalidad inválida. Use: presencial, virtual o mixta');
  }
  const { data, error } = await repo.insertElective({
    name: payload.name,
    description: payload.description,
    credits: payload.credits ?? 3,
    max_capacity: payload.max_capacity,
    modality: payload.modality,
  });
  if (error) throw ApiError.internal('Error al crear electiva');
  return data;
}

async function updateElective(id, payload) {
  const { data: existing } = await repo.getElectiveById(id);
  if (!existing) throw ApiError.notFound('Electiva no encontrada');

  if (payload.modality && !MODALITIES.includes(payload.modality)) {
    throw ApiError.badRequest('Modalidad inválida');
  }

  const updates = {};
  ['name', 'description', 'credits', 'max_capacity', 'modality'].forEach((key) => {
    if (payload[key] !== undefined) updates[key] = payload[key];
  });
  updates.updated_at = new Date().toISOString();

  const { data, error } = await repo.updateElective(id, updates);
  if (error) throw ApiError.internal('Error al actualizar electiva');
  return data;
}

async function deleteElective(id) {
  const { data: offerings } = await repo.findOfferingsByElective(id);
  if (offerings && offerings.length > 0) {
    const { data: enrollments } = await repo.findActiveEnrollmentsByOfferings(
      offerings.map((o) => o.id)
    );
    if (enrollments && enrollments.length > 0) {
      throw ApiError.conflict('No se puede eliminar una electiva con inscripciones activas');
    }
  }
  const { error } = await repo.softDeleteElective(id);
  if (error) throw ApiError.internal('Error al eliminar electiva');
}

// ---------- Ofertas ----------

async function listOfferings() {
  const { data, error } = await repo.listOfferings();
  if (error) throw ApiError.internal('Error al obtener ofertas de cursos');
  return data;
}

async function createOffering(payload) {
  const { data, error } = await repo.insertOffering(payload);
  if (error) throw ApiError.internal('Error al crear oferta de curso');
  return data;
}

async function updateOffering(id, payload) {
  const { data: existing } = await repo.getOfferingById(id);
  if (!existing) throw ApiError.notFound('Oferta de curso no encontrada');

  const updates = { updated_at: new Date().toISOString() };
  ['schedule', 'classroom', 'available_spots', 'teacher_id'].forEach((key) => {
    if (payload[key] !== undefined) updates[key] = payload[key];
  });

  const { data, error } = await repo.updateOffering(id, updates);
  if (error) throw ApiError.internal('Error al actualizar oferta de curso');
  return data;
}

async function deleteOffering(id) {
  const { data: enrollments } = await repo.findActiveEnrollmentsByOffering(id);
  if (enrollments && enrollments.length > 0) {
    throw ApiError.conflict('No se puede eliminar una oferta con inscripciones activas');
  }
  const { error } = await repo.softDeleteOffering(id);
  if (error) throw ApiError.internal('Error al eliminar oferta de curso');
}

async function getAdminStats() {
  const { count, error } = await repo.countActiveEnrollments();
  if (error) throw ApiError.internal('Error al obtener estadísticas');
  return { inscritos: count };
}

module.exports = {
  listElectives, getElectiveById, createElective, updateElective, deleteElective,
  listOfferings, createOffering, updateOffering, deleteOffering, getAdminStats,
};
