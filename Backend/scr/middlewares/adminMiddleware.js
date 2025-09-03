const adminMiddleware = (req, res, next) => {
  // O objeto req.user é adicionado pelo authMiddleware
  if (req.user && req.user.role === 'admin') {
    return next(); // O usuário é admin, pode prosseguir
  }

  return res.status(403).json({ message: 'Acesso negado. Requer permissão de administrador.' });
};

module.exports = adminMiddleware;