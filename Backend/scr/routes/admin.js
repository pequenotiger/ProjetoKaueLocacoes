const express = require('express');
const db = require('../config/db');
const adminMiddleware = require('../middlewares/adminMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const { z } = require('zod');

const router = express.Router();

router.use(adminMiddleware);

const updateUserRoleSchema = z.object({
  role: z.enum(['user', 'admin'], {
    errorMap: () => ({ message: "A role deve ser 'user' ou 'admin'." }),
  }),
});

router.get('/usuarios', async (req, res, next) => {
  try {
    const result = await db.query('SELECT id, nome, email, role, created_at FROM usuarios ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

router.put('/usuarios/:id', validateRequest(updateUserRoleSchema), async (req, res, next) => {
  const { id } = req.params;
  const { role } = req.body;

  if (Number(id) === req.user.id) {
    return res.status(403).json({ message: 'Não é possível alterar a sua própria role.' });
  }

  try {
    const result = await db.query(
      'UPDATE usuarios SET role = $1 WHERE id = $2 RETURNING id, nome, email, role',
      [role, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

router.get('/tickets', async (req, res, next) => {
  try {
    const result = await db.query(`
      SELECT t.id, t.title, t.status, t.created_at, u.nome as user_nome, p.name as product_name
      FROM tickets t
      JOIN usuarios u ON t.user_id = u.id
      JOIN produtos p ON t.product_id = p.id
      ORDER BY t.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

module.exports = router;