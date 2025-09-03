const validateRequest = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    next(error); // Passa o erro de validação para o errorHandler
  }
};

module.exports = validateRequest;