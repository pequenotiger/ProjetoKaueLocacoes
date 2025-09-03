const express = require('express');
const db = require('../config/db');
const { hashPassword } = require('../utils/security');
const { z } = require('zod');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

const createUserSchema = z.object({
  nome: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
  email: z.string().email({ message: 'Formato de e-mail inválido.' }),
  senha: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
});

router.post('/', validateRequest(createUserSchema), async (req, res, next) => {
  const { nome, email, senha } = req.body;

  try {
    const hashedPassword = await hashPassword(senha);
    const result = await db.query(
      'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email, role',
      [nome, email, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') { 
        return res.status(409).json({ message: 'Este e-mail já está em uso.' });
    }
    next(error);
  }
});

module.exports = router;