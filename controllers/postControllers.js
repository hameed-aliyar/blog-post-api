const prisma = require('../config/db.js');

const getPosts = async (req, res, next) => {
    try {
        const posts = await prisma.post.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.json(posts);
    } catch (error) {
        next(error);
    }
};

const getPostById  = async (req, res, next) => {
    const { id } = req.params;
    try {
        const sqlQuery = 'SELECT * FROM posts WHERE id = $1';
        const values = [id];
        //const result = await pool.query(sqlQuery, values);
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
    try {
        const { title, content, author } = req.body;
        if (!title || typeof title !== 'string' || title.trim() === '') {
            return res.status(400).json({ message: 'Validation Error: The "title" field is required.' });
        }
        if (!content || typeof content !== 'string' || content.trim() === '') {
            return res.status(400).json({ message: 'Validation Error: The "content" field is required.' });
        }
        const newPostData = {
            title: title.trim(), 
            content: content.trim(), 
            author: (author && author.trim()) ? author.trim() : 'Guest' // Handles default author
        };
        const post = await prisma.post.create({
            data: newPostData,
        });
        res.status(201).json(post);
    } catch (error) {
        next(error);
    }
};

const updatePost = async (req, res, next) => {
    try {
        const idToUpdate = parseInt(req.params.id);
        const newData = req.body;
        if (
            (newData.text !== undefined && (typeof newData.text !== 'string' || newData.text.trim() === '')) ||
            (newData.completed !== undefined && typeof newData.completed !== 'boolean')
        ) {
            return res.status(400).json({ message: 'Validation Error: Invalid data provided.' });
        }
        const updatedPost = await prisma.post.update({
            where: {
                id: idToUpdate,
            },
            data: newData,
        });
        res.json(updatedPost);
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: `Post with ID ${req.params.id} not found.` });
        }
        next(error);
    }
};

const deletePost = async (req, res, next) => {
    try {
        const idToDelete = parseInt(req.params.id);
        await prisma.post.delete({
            where: {
                id: idToDelete,
            },
        });
        res.sendStatus(204);
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: `Post with ID ${req.params.id} not found.` });
        }
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