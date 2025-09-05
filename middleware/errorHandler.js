function errorHandler(err, req, res, next) {
    console.error('ERROR:', err.stack);
    res.status(500).json({ message: 'Something went wrong on the server.' });
}

module.exports = errorHandler;