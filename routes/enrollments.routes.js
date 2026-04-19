const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/auth.middleware');
const {
  enroll, cancelEnrollment, getEnrollmentsByOffering, getMyEnrollments
} = require('../controllers/enrollments.controller');

router.post('/', verifyToken, enroll);
router.delete('/:id', verifyToken, cancelEnrollment);
router.get('/mis-inscripciones', verifyToken, getMyEnrollments);
router.get('/oferta/:offering_id', verifyToken, requireAdmin, getEnrollmentsByOffering);

module.exports = router;
