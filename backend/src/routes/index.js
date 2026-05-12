const express = require('express');
const authRoutes = require('../modules/auth/auth.routes');
const coursesRoutes = require('../modules/courses/courses.routes');
const enrollmentsRoutes = require('../modules/enrollments/enrollments.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/cursos', coursesRoutes);
router.use('/inscripciones', enrollmentsRoutes);

module.exports = router;
