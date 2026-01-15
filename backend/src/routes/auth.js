const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const db = require('../db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretcode';

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

function validatePassword(password) {
    if (!password) {
        return { valid: false, message: 'Password is required' };
    }
    if(!validator.isStrongPassword(password, PASSWORD_VALIDATION_OPTIONS)) {
        return {
            valid: false,
            message: 'Password must be at least 8 characters with uppercase, lowercase, number and symmbol'
        };
    }
    return {valid: true};
}

// endpoints
router.post('/register', async (req, res)=> {
    const { email, password } = req.body;

    //validate email
    const emailValidated = await validateEmail(email);
    if(!emailValidated.valid) {
        return res.status(400).json({error: emailValidated.message});
    }
    const normalizedEmail = validator.normalizeEmail(email);

    //validate password
    const passwordValidated = await validatePassword(password);
    if(!passwordValidated.valid) {
        return res.status(400).json({error: passwordValidated.message});
    }

    try {
        const existing = await db.query('SELECT * FROM users WHERE email=$1', [normalizedEmail]);
        if(existing.rows.length > 0) {
            return res.status(400).json({error: 'Email already exists'});
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const result = await db.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email', [normalizedEmail, passwordHash]
        );

        const user = result.rows[0];
        const token = jwt.sign({userId: user.id}, JWT_SECRET, {expiresIn: '30m'});

        res.status(201).json({token, user: {id: user.id, email: user.email} });
    } catch (error) {
        console.error('Error: ', error);
        res.status(500).json({error: 'Something went wrong with registering the user.'});

    }
});

router.post('/login', async (req, res)=> {
    const { email, password } = req.body;

    const emailValidated = await validateEmail(email);
    if(!emailValidated.valid) {
        return res.status(400).json({error: emailValidated.message});
    }
    const normalizedEmail = validator.normalizeEmail(email);

    if(!password) {
        return res.status(400).json({error: 'Password is required.'});
    }

    try {
        const result = await db.query('SELECT * FROM users WHERE email=$1', [normalizedEmail]);
        const user = result.rows[0];

        if(!user) {
            return res.status(400).json({error: 'Email or password is not correct.'});
        }
        const valid = await bcrypt.compare(password, user.password_hash);
        if(!valid) {
            return res.status(400).json({error: 'Invalid credentials'});
        }
        const token = jwt.sign({userId: user.id}, JWT_SECRET, {expiresIn: '30m'});
        res.json({token, user: {id: user.id, email: user.email}});

    } catch (error) {
        console.error('Login error: ', error);
        res.status(500).json({error: 'Something went wrong with logining the user.'});
    }
})

module.exports = router;