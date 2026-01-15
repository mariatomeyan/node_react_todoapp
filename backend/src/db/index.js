const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://localhost:5432/todoapp',
})

pool.on('error', (err) => {
    console.error('Error on client:', err);
})

module.exports = {
    query:(text, params) => pool.query(text, params),
    pool
};