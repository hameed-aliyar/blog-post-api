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

// controllers/postController.js

const createPost = async (req, res, next) => {
    res.send('CREATE POST - LOGIC PENDING'); // Placeholder
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