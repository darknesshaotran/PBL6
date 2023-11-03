const { Server } = require('socket.io');
const ErrorsWithStatus = require('../constants/Error');
const { USERS_MESSAGES } = require('../constants/messages');
const HTTP_STATUS = require('../constants/httpStatus');
const db = require('../models');
const { Op } = require('sequelize');

const initSocket = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: '*',
        },
    });
    const users = {};
    io.on('connection', (socket) => {
        console.log(`user ${socket.id} connected`);

        socket.on('error', (error) => {
            console.log('error socket:', error);
        });
        socket.on('hello', (data) => {
            console.log('hello', data);
        });

        socket.on('disconnect', () => {
            console.log(`user ${socket.id} disconnected`);
            // console.log(users)
        });
    });
};

module.exports = initSocket;
