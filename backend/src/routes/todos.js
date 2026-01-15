const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

router.get('/', async (req, res) => {
    const result = await db.query(
        'SELECT * FROM todos WHERE user_id = $1 ORDER BY created_at DESC',
        [req.userId]
    );
    res.json(result.rows);
});

router.post('/', async (req, res) => {
    const title = req.body.title?.trim();
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const result = await db.query(
        'INSERT INTO todos (user_id, title) VALUES ($1, $2) RETURNING *',
        [req.userId, title]
    );
    res.status(201).json(result.rows[0]);
});

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { title, completed } = req.body;

    // check ownership
    const check = await db.query(
        'SELECT 1 FROM todos WHERE id = $1 AND user_id = $2', [id, req.userId]
    );
    if (!check.rows.length) {
        return res.status(404).json({ error: 'Not found' });
    }

    // dynamically build query based on what fields are provided
    const fields = [];
    const vals = [];
    let n = 1;

    if (title !== undefined) {
        fields.push('title = $' + n++);
        vals.push(title.trim());
    }
    if (completed !== undefined) {
        fields.push('completed = $' + n++);
        vals.push(completed);
    }

    if (!fields.length) {
        return res.status(400).json({ error: 'Nothing to update' });
    }

    vals.push(id, req.userId);

    const q = `UPDATE todos SET ${fields.join(', ')} WHERE id = $${n++} AND user_id = $${n} RETURNING *`;
    const result = await db.query(q, vals);
    res.json(result.rows[0]);
});

router.delete('/:id', async (req, res) => {
    const result = await db.query(
        'DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING id',
        [req.params.id, req.userId]
    );

    if (!result.rows.length) {
        return res.status(404).json({ error: 'Not found' });
    }
    res.json({ deleted: true });
});

module.exports = router;
