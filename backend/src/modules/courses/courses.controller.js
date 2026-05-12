const service = require('./courses.service');

// ---------- Electivas ----------

async function getElectives(_req, res) {
  res.json(await service.listElectives());
}

async function getElectiveById(req, res) {
  res.json(await service.getElectiveById(req.params.id));
}

async function createElective(req, res) {
  const electiva = await service.createElective(req.body);
  res.status(201).json({ mensaje: 'Electiva creada exitosamente', electiva });
}

async function updateElective(req, res) {
  const electiva = await service.updateElective(req.params.id, req.body);
  res.json({ mensaje: 'Electiva actualizada exitosamente', electiva });
}

async function deleteElective(req, res) {
  await service.deleteElective(req.params.id);
  res.json({ mensaje: 'Electiva eliminada exitosamente' });
}

// ---------- Ofertas ----------

async function getOfferings(_req, res) {
  res.json(await service.listOfferings());
}

async function createOffering(req, res) {
  const oferta = await service.createOffering(req.body);
  res.status(201).json({ mensaje: 'Oferta de curso creada exitosamente', oferta });
}

async function updateOffering(req, res) {
  const oferta = await service.updateOffering(req.params.id, req.body);
  res.json({ mensaje: 'Oferta actualizada exitosamente', oferta });
}

async function deleteOffering(req, res) {
  await service.deleteOffering(req.params.id);
  res.json({ mensaje: 'Oferta eliminada exitosamente' });
}

async function getAdminStats(_req, res) {
  res.json(await service.getAdminStats());
}

module.exports = {
  getElectives, getElectiveById, createElective, updateElective, deleteElective,
  getOfferings, createOffering, updateOffering, deleteOffering, getAdminStats,
};
