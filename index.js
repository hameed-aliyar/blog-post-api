const express = require('express');

require('dotenv').config();

const app = express();



PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on https://localhost:${PORT}`);
});