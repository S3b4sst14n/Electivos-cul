const express = require('express');
const asyncHandler = require('../../utils/asyncHandler');
const validate = require('../../middleware/validate.middleware');
const { verifyToken, requireAdmin } = require('../../middleware/auth.middleware');
const ctrl = require('./enrollments.controller');
const { validateEnroll } = require('./enrollments.validators');

const router = express.Router();

router.post('/', verifyToken, validate(validateEnroll), asyncHandler(ctrl.enroll));
router.delete('/:id', verifyToken, asyncHandler(ctrl.cancelEnrollment));
router.get('/mis-inscripciones', verifyToken, asyncHandler(ctrl.getMyEnrollments));
router.get('/oferta/:offering_id', verifyToken, requireAdmin, asyncHandler(ctrl.getEnrollmentsByOffering));

module.exports = router;
