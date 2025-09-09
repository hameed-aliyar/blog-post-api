const { Pool } = require('pg');

const pool = new Pool({
    user: 'blog_user',
    host: 'localhost',
    database: 'blog_api',
    password: 'ENTER_YOUR_DATABASE_PASSWORD_HERE', 
    port: 5432,
});

module.exports = pool;