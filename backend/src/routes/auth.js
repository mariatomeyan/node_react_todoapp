const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const db = require('./db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || supersecretcode;

//Requirments for password
const PASSWORD_VALIDATION_OPTIONS = {
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
}

function validateEmail(email) {
    if (!email) {
        return { valid: false, message: 'Email is required' };
    }
    if(!validator.isEmail(email)) {
        return { valid: false, message: 'Invalid email address' };
    }
    return {valid: true};
}

// endpoints
router.post('/register', async (req, res)=> {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({error: 'Email and password required'});
    }

    if(password.length < 6) {
        return res.status(400).json({error: 'Password must be at least 6 characters'});
    }

    try {
        const existing = await db.query('SELECT * FROM users WHERE email=$1', [email]);
        if(!existing.rows.length > 0) {
            return res.status(400).json({error: 'Email already exists'});
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const result = await db.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email', [email, passwordHash]
        );

        const user = result.rows[0];
        const token = jwt.sign({userId: user.id}, JWT_SECRET, {expiresIn: '30m'});

        res.status(201).json({token, user: {id: user.id, email: user.email} });
    } catch (error) {
        console.error('Error: ', error);
        res.status(500).json({error: 'Something went wrong with registering the user.'});

    }
});

module.exports = router;