const { ZodError } = require('zod');

const errorHandler = (err, req, res, next) => {
  console.error(err); // Log do erro para depuração

  if (err instanceof ZodError) {
    // Erro de validação do Zod
    return res.status(400).json({
      message: 'Dados de entrada inválidos.',
      errors: err.errors.map(e => ({ path: e.path.join('.'), message: e.message })),
    });
  }
  
  // Erros conhecidos podem ter um status code
  if (err.statusCode) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  // Erro genérico do servidor
  return res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' });
};

module.exports = errorHandler;