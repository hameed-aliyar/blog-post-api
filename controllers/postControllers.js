let { posts, nextId, saveDataToFile } = require('../models/db.js');

const getPosts = (req, res) => {
    res.json(posts);
};

const getPost = (req, res) => {
    const idToGet = parseInt(req.params.id);
    const indexToGet = posts.findIndex(post => post.id === idToGet);
    if(indexToGet === -1) {
        return res.status(404).json({ message: "Post not found." });
    }
    res.json(posts[indexToGet]);
};

const createPost = async (req, res) => {
    const newPostData = req.body;
    if (!newPostData.title || typeof newPostData.title !== 'string' || newPostData.title.trim() === '') {
        return res.status(400).json({ message: 'Validation Error: The "title" field is required and must be a non-empty string.' });
    }
    if (!newPostData.content || typeof newPostData.content !== 'string' || newPostData.content.trim() === '') {
        return res.status(400).json({ message: 'Validation Error: The "content" field is required and must be a non-empty string.' });
    }
    const author = newPostData.author && newPostData.author.trim() !== '' ? newPostData.author.trim() : 'Guest';
    const newPost = {
        id: nextId++,
        title: newPostData.title,
        content: newPostData.content,
        author: author,
        timestamp: new Date().toISOString()
    };
    posts.push(newPost);
    await saveDataToFile();
    res.status(201).json(newPost);
};

const updatePost = async (req, res) => {
    const idToUpdate = parseInt(req.params.id);
    const newData = req.body;
    if (
        (newData.title !== undefined && (typeof newData.title !== 'string' || newData.title.trim() === '')) ||
        (newData.content !== undefined && (typeof newData.content !== 'string' || newData.content.trim() === '')) ||
        (newData.author !== undefined && (typeof newData.author !== 'string' || newData.author.trim() === ''))
    ) {
        return res.status(400).json({ message: 'Validation Error: If provided, fields must be non-empty strings.' });
    }
    const indexToUpdate = posts.findIndex(post => post.id === idToUpdate);
    if(indexToUpdate === -1) {
        return res.status(400).json({ message: 'Post not found.' });
    }
    const updatedPost = { ...posts[indexToUpdate], ...newData };
    posts[indexToUpdate] = updatedPost;
    await saveDataToFile();
    res.json(updatedPost);
};

const deletePost = async (req, res) => {
    const idToRemove = parseInt(req.params.id);
    const indexToRemove = posts.findIndex(post => post.id === idToRemove);
    if(indexToRemove === -1) {
        return res.status(404).json({ message: "Post not found." });
    }
    posts.splice(indexToRemove, 1);
    await saveDataToFile();
    res.sendStatus(204);
};

module.exports = {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost
}