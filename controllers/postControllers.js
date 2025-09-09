const pool = require('../config/db.js');

const getPosts = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM posts ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
};

const getPostById  = async (req, res, next) => {
    const { id } = req.params;
    try {
        const sqlQuery = 'SELECT * FROM posts WHERE id = $1';
        const values = [id];
        const result = await pool.query(sqlQuery, values);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: `Post with ID ${id} not found` });
        }
        const post = result.rows[0];
        res.json(post);
    } catch (error) {
        next(error);
    }
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

const updatePost = async (req, res, next) => {
    const { id } = req.params;
    const { title, content, author } = req.body;
    try {
        if (
            (title !== undefined && (typeof title !== 'string' || title.trim() === '')) ||
            (content !== undefined && (typeof content !== 'string' || content.trim() === '')) ||
            (author !== undefined && (typeof author !== 'string' || author.trim() === ''))
        ) {
            return res.status(400).json({ message: 'Validation Error: Invalid data provided.' });
        }
        const findQuery = 'SELECT * FROM posts WHERE id = $1';
        const findResult = await pool.query(findQuery, [id]);
        if (findResult.rows.length === 0) {
            return res.status(404).json({ message: `Post with ID ${id} not found.` });
        }
        const originalPost = findResult.rows[0];
        const updateQuery = `
            UPDATE posts 
            SET title = $1, content = $2, author = $3 
            WHERE id = $4 
            RETURNING *;
        `;
        const values = [
            title !== undefined ? title.trim() : originalPost.title,
            content !== undefined ? content.trim() : originalPost.content,
            author !== undefined ? author.trim() : originalPost.author,
            id
        ];
        const result = await pool.query(updateQuery, values);
        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

const deletePost = async (req, res, next) => {
    const { id } = req.params;
    try {
        const sqlQuery = 'DELETE FROM posts WHERE id = $1 RETURNING *;';
        const values = [id];        
        const result = await pool.query(sqlQuery, values);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: `Post with ID ${id} not found.` });
        }
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getPosts,
    getPostById ,
    createPost,
    updatePost,
    deletePost
}