const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/auth.middleware');
const {
  getElectives, getElectiveById, createElective, updateElective, deleteElective,
  getOfferings, createOffering, updateOffering, deleteOffering, getAdminStats
} = require('../controllers/courses.controller');

// Ofertas (course_offerings) — rutas específicas antes que /:id para evitar conflicto
router.get('/ofertas/stats', verifyToken, requireAdmin, getAdminStats);
router.get('/ofertas/lista', getOfferings);
router.post('/ofertas/nueva', verifyToken, requireAdmin, createOffering);
router.put('/ofertas/:id', verifyToken, requireAdmin, updateOffering);
router.delete('/ofertas/:id', verifyToken, requireAdmin, deleteOffering);

// Electivas (elective_courses)
router.get('/', getElectives);
router.get('/:id', getElectiveById);
router.post('/', verifyToken, requireAdmin, createElective);
router.put('/:id', verifyToken, requireAdmin, updateElective);
router.delete('/:id', verifyToken, requireAdmin, deleteElective);

module.exports = router;
