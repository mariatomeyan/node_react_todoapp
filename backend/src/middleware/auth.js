const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'supersecretcode';

module.exports = function(req, res, next) {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ error: 'No token' });

    const parts = header.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ error: 'Bad token format' });
    }

    try {
        const decoded = jwt.verify(parts[1], secret);
        req.userId = decoded.userId;
        next();
    } catch (e) {
        res.status(401).json({ error: 'Invalid token' });
    }
};
