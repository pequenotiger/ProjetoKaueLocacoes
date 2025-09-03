const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../config/db');
const { z } = require('zod');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

// Schema para atualizar os dados do perfil (nome e email)
const updateProfileSchema = z.object({
  nome: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
  email: z.string().email({ message: 'Formato de e-mail inválido.' }),
});

// Schema para atualizar a senha
const updatePasswordSchema = z.object({
    currentPassword: z.string().min(1, { message: 'A senha atual é obrigatória.' }),
    newPassword: z.string().min(6, { message: 'A nova senha deve ter pelo menos 6 caracteres.' }),
});

// Rota para BUSCAR os dados do usuário logado
router.get('/', async (req, res, next) => {
    try {
        const result = await db.query('SELECT id, nome, email, role FROM usuarios WHERE id = $1', [req.user.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

// Rota para ATUALIZAR os dados do perfil (nome e email)
router.put('/', validateRequest(updateProfileSchema), async (req, res, next) => {
    const { nome, email } = req.body;
    try {
        const result = await db.query(
            'UPDATE usuarios SET nome = $1, email = $2 WHERE id = $3 RETURNING id, nome, email, role',
            [nome, email, req.user.id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        if (error.code === '23505') { // Erro de e-mail duplicado
            return res.status(409).json({ message: 'Este e-mail já está em uso por outra conta.' });
        }
        next(error);
    }
});

// Rota para ATUALIZAR a senha
router.put('/password', validateRequest(updatePasswordSchema), async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;
    try {
        const userResult = await db.query('SELECT senha FROM usuarios WHERE id = $1', [req.user.id]);
        const user = userResult.rows[0];

        const isPasswordCorrect = await bcrypt.compare(currentPassword, user.senha);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'A senha atual está incorreta.' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await db.query('UPDATE usuarios SET senha = $1 WHERE id = $2', [hashedNewPassword, req.user.id]);
        
        res.json({ message: 'Senha atualizada com sucesso!' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;