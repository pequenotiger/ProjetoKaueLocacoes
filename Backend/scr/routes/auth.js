const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../config/db');
const { generateToken } = require('../utils/security');
const { z } = require('zod');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

const loginSchema = z.object({
  email: z.string().email({ message: 'Formato de e-mail inválido.' }),
  senha: z.string().min(1, { message: 'A senha é obrigatória.' }),
});

router.post('/login', validateRequest(loginSchema), async (req, res, next) => {
  const { email, senha } = req.body;

  try {
    const result = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const user = result.rows[0];
    const isPasswordCorrect = await bcrypt.compare(senha, user.senha);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }
    
    const token = generateToken({ id: user.id, role: user.role });
    
    res.json({ token, user: { id: user.id, nome: user.nome, email: user.email, role: user.role } });

  } catch (error) {
    next(error);
  }
});

module.exports = router;