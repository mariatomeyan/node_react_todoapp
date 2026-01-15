const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// get todos list
router.get('/', async (req, res) => {
    try {
        const { rows } = await db.query(
            'SELECT * FROM todos WHERE user_id = $1 ORDER BY created_at DESC',
            [req.userId]
        );
        res.json(rows);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Server error' });
    }
});

// add new todo
router.post('/', async (req, res) => {
    const title = req.body.title?.trim();

    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }

    try {
        const { rows } = await db.query(
            'INSERT INTO todos (user_id, title) VALUES ($1, $2) RETURNING *',
            [req.userId, title]
        );
        res.status(201).json(rows[0]);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Server error' });
    }
});

// update todo
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, completed } = req.body;

    // make sure todo exists and belongs to user
    const existing = await db.query(
        'SELECT id FROM todos WHERE id = $1 AND user_id = $2',
        [id, req.userId]
    );

    if (existing.rows.length === 0) {
        return res.status(404).json({ error: 'Todo not found' });
    }

    // build update query dynamically
    let query = 'UPDATE todos SET ';
    let params = [];
    let i = 1;

    if (title !== undefined) {
        query += `title = $${i++}, `;
        params.push(title.trim());
    }
    if (completed !== undefined) {
        query += `completed = $${i++}, `;
        params.push(completed);
    }

    if (params.length === 0) {
        return res.status(400).json({ error: 'Nothing to update' });
    }

    // remove trailing comma and add WHERE clause
    query = query.slice(0, -2);
    query += ` WHERE id = $${i++} AND user_id = $${i} RETURNING *`;
    params.push(id, req.userId);

    try {
        const { rows } = await db.query(query, params);
        res.json(rows[0]);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Server error' });
    }
});

// delete todo
router.delete('/:id', async (req, res) => {
    try {
        const { rows } = await db.query(
            'DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING id',
            [req.params.id, req.userId]
        );

        if (!rows.length) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        res.json({ message: 'Deleted' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;

