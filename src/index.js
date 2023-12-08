const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const route = require('./routes/index.js');
const conenctionDatabase = require('../connect_db.js');
const ErrorHandler = require('../src/middlewares/error.middlewares.js');
const dotenv = require('dotenv');
const initSocket = require('./utils/socket.js');
dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();
const httpServer = createServer(app);

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

conenctionDatabase();
route(app);

// note : dat middlewares error handler tai noi cuoi cung
app.use(ErrorHandler);
initSocket(httpServer);
httpServer.listen(PORT, () => console.log(`listening on  http://localhost:${PORT}`));
