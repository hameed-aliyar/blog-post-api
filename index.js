const express = require('express');
const morgan = require('morgan');
const postsRouter = require('./routes/postsRouter.js');
const errorHandler = require('./middleware/errorHandler.js');

require('dotenv').config();

const app = express();
if (process.env.NODE_ENV === 'development') {
    app.set('json spaces', 2);
}
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('Welcome to Blog Post API.')
});

app.use('/posts', postsRouter);

app.use(errorHandler);
app.listen((process.env.PORT || 4000), () => {
    console.log(`Server is running on http://localhost:${process.env.PORT || 4000}`);
});