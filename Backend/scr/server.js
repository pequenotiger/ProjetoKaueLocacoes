require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const profileRoutes = require('./routes/profile');

// Middlewares
const authMiddleware = require('./middlewares/authMiddleware');
const adminMiddleware = require('./middlewares/adminMiddleware');
const errorHandler = require('./middlewares/errorHandler');

// Rotas
const authRoutes = require('./routes/auth');
const usuariosRoutes = require('./routes/usuarios');
const produtosRoutes = require('./routes/produtos');
const ticketsRoutes = require('./routes/tickets');
const adminRoutes = require('./routes/admin');

const app = express();

// Middlewares essenciais
app.use(cors());
app.use(helmet());
app.use(express.json());

// --- ROTAS PÚBLICAS ---
app.use('/auth', authRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/produtos', produtosRoutes); // <-- MOVEMOS ESTA LINHA PARA CÁ

// --- ROTAS PROTEGIDAS ---
app.use('/tickets', authMiddleware, ticketsRoutes);
app.use('/admin', authMiddleware, adminMiddleware, adminRoutes);
app.use('/profile', authMiddleware, profileRoutes);

// Middleware de Tratamento de Erros
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});