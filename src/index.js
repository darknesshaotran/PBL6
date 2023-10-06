const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const route = require('./routes/index.js');
const conenctionDatabase = require('../connect_db.js');
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 8888;
const app = express();
const httpServer = createServer(app);
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
conenctionDatabase();
route(app);
httpServer.listen(PORT, () => console.log(`listening on  http://localhost:${PORT}`));
