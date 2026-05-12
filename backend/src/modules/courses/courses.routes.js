const express = require('express');
const asyncHandler = require('../../utils/asyncHandler');
const validate = require('../../middleware/validate.middleware');
const { verifyToken, requireAdmin } = require('../../middleware/auth.middleware');
const ctrl = require('./courses.controller');
const { validateCreateElective, validateCreateOffering } = require('./courses.validators');

const router = express.Router();

// Ofertas (rutas específicas antes que /:id para evitar conflicto)
router.get('/ofertas/stats', verifyToken, requireAdmin, asyncHandler(ctrl.getAdminStats));
router.get('/ofertas/lista', asyncHandler(ctrl.getOfferings));
router.post('/ofertas/nueva', verifyToken, requireAdmin, validate(validateCreateOffering), asyncHandler(ctrl.createOffering));
router.put('/ofertas/:id', verifyToken, requireAdmin, asyncHandler(ctrl.updateOffering));
router.delete('/ofertas/:id', verifyToken, requireAdmin, asyncHandler(ctrl.deleteOffering));

// Electivas
router.get('/', asyncHandler(ctrl.getElectives));
router.get('/:id', asyncHandler(ctrl.getElectiveById));
router.post('/', verifyToken, requireAdmin, validate(validateCreateElective), asyncHandler(ctrl.createElective));
router.put('/:id', verifyToken, requireAdmin, asyncHandler(ctrl.updateElective));
router.delete('/:id', verifyToken, requireAdmin, asyncHandler(ctrl.deleteElective));

module.exports = router;
