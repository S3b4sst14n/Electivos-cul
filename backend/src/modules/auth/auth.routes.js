const express = require('express');
const asyncHandler = require('../../utils/asyncHandler');
const validate = require('../../middleware/validate.middleware');
const { register, login } = require('./auth.controller');
const { validateRegister, validateLogin } = require('./auth.validators');

const router = express.Router();

router.post('/register', validate(validateRegister), asyncHandler(register));
router.post('/login', validate(validateLogin), asyncHandler(login));

module.exports = router;
