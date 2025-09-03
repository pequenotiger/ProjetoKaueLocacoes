const express = require('express');
const db = require('../config/db');
const { z } = require('zod');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

const ticketSchema = z.object({
  title: z.string().min(1, "O título é obrigatório."),
  description: z.string().min(1, "A descrição é obrigatória."),
  product_id: z.number().int().positive("ID do produto inválido."),
});

const commentSchema = z.object({
  content: z.string().min(1, "O conteúdo do comentário é obrigatório."),
});

const updateTicketSchema = z.object({
  title: z.string().min(1, "O título é obrigatório.").optional(),
  description: z.string().min(1, "A descrição é obrigatória.").optional(),
  status: z.enum(['aberto', 'em_andamento', 'fechado']).optional(),
});


// Rota para CRIAR um novo ticket
router.post('/', validateRequest(ticketSchema), async (req, res, next) => {
  const { title, description, product_id } = req.body;
  const user_id = req.user.id;

  try {
    const result = await db.query(
      'INSERT INTO tickets (title, description, status, user_id, product_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, 'aberto', user_id, product_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Rota para LISTAR os tickets do usuário logado
router.get('/', async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM tickets WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Rota para BUSCAR um ticket específico pelo ID
router.get('/:id', async (req, res, next) => {
    const { id } = req.params;
    const { id: userId, role } = req.user;
    try {
        const query = (role === 'admin')
            ? 'SELECT * FROM tickets WHERE id = $1'
            : 'SELECT * FROM tickets WHERE id = $1 AND user_id = $2';
        const params = (role === 'admin') ? [id] : [id, userId];
        
        const result = await db.query(query, params);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Ticket não encontrado ou acesso negado.' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

// Rota para ATUALIZAR um ticket
router.put('/:id', validateRequest(updateTicketSchema), async (req, res, next) => {
  const { id } = req.params;
  const { title, description, status } = req.body;
  const { id: userId, role } = req.user;

  if (!title && !description && !status) {
    return res.status(400).json({ message: 'Nenhum dado para atualizar.' });
  }

  if (role !== 'admin' && status) {
    return res.status(403).json({ message: 'Você não tem permissão para alterar o status.' });
  }

  try {
    const ticketResult = await db.query('SELECT user_id, title, description, status FROM tickets WHERE id = $1', [id]);
    if (ticketResult.rows.length === 0) {
      return res.status(404).json({ message: 'Ticket não encontrado.' });
    }

    if (role !== 'admin' && ticketResult.rows[0].user_id !== userId) {
      return res.status(403).json({ message: 'Você não tem permissão para editar este ticket.' });
    }
    
    const currentTicket = ticketResult.rows[0];
    const result = await db.query(
      'UPDATE tickets SET title = $1, description = $2, status = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [
        title || currentTicket.title,
        description || currentTicket.description,
        status || currentTicket.status,
        id
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});


// Rota para LISTAR os comentários de um ticket
router.get('/:id/comments', async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await db.query(`
      SELECT c.id, c.content, c.created_at, u.nome as user_nome
      FROM comentarios c
      JOIN usuarios u ON c.user_id = u.id
      WHERE c.ticket_id = $1
      ORDER BY c.created_at ASC
    `, [id]);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Rota para CRIAR um novo comentário em um ticket
router.post('/:id/comments', validateRequest(commentSchema), async (req, res, next) => {
  const { id: ticket_id } = req.params;
  const { content } = req.body;
  const user_id = req.user.id;

  try {
    const result = await db.query(
      'INSERT INTO comentarios (content, user_id, ticket_id) VALUES ($1, $2, $3) RETURNING id, content, created_at',
      [content, user_id, ticket_id]
    );
    const userResult = await db.query('SELECT nome FROM usuarios WHERE id = $1', [user_id]);
    const newComment = {
        ...result.rows[0],
        user_nome: userResult.rows[0].nome
    };
    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
});

module.exports = router;