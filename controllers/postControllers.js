const pool = require('../config/db.js');

const getPosts = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM posts ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
};

const getPost = async (req, res, next) => {
    res.send('GET POST - LOGIC PENDING');
};

const createPost = async (req, res, next) => {
    const { title, content, author } = req.body;
    try {
        if (!title || typeof title !== 'string' || title.trim() === '') {
            return res.status(400).json({ message: 'Validation Error: The "title" field is required.' });
        }
        if (!content || typeof content !== 'string' || content.trim() === '') {
            return res.status(400).json({ message: 'Validation Error: The "content" field is required.' });
        }
        const sqlQuery = `
            INSERT INTO posts (title, content, author) 
            VALUES ($1, $2, $3) 
            RETURNING *;
        `;
        const values = [
            title.trim(), 
            content.trim(), 
            (author && author.trim()) ? author.trim() : 'Guest' // Handles default author
        ];
        const result = await pool.query(sqlQuery, values);
        const newPost = result.rows[0];
        res.status(201).json(newPost);
    } catch (error) {
        next(error);
    }
};

const updatePost = async (req, res) => {
    res.send('UPDATE POST - LOGIC PENDING');
};

const deletePost = async (req, res) => {
    res.send('DELETE POST - LOGIC PENDING');
};

module.exports = {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost
}