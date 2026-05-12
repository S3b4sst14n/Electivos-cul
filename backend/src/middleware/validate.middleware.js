const ApiError = require('../utils/ApiError');

function validate(validator) {
  return (req, _res, next) => {
    const result = validator(req);
    if (result && result.error) {
      return next(ApiError.badRequest(result.error, result.details));
    }
    next();
  };
}

module.exports = validate;
