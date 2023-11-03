const { Server } = require('socket.io');
const ErrorsWithStatus = require('../constants/Error');
const { USERS_MESSAGES } = require('../constants/messages');
const HTTP_STATUS = require('../constants/httpStatus');
const db = require('../models');
const { Op } = require('sequelize');
const messageServices = require('../services/message.services');

const initSocket = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: '*',
        },
    });
    const users = {};
    io.on('connection', (socket) => {
        console.log(`user ${socket.id} connected`);
        const userID = socket.handshake.auth.id;
        // kiểm tra đã đăng nhập hay chưa
        if (userID) {
            users[userID] = {
                socket_id: socket.id,
            };
            // server lắng nghe sự kiện send_message của socket A, gửi đến socket B sự kiện receive_message
            socket.on('send_message', async (data) => {
                const socket_id_receiver = users[data.id_receiver].socket_id;
                if (socket_id_receiver) {
                    io.to(socket_id_receiver).emit('receive_message', { content: data.content, id_sender: userID });
                }
                await messageServices.addMessage(data.id_receiver, userID, data.content);
            });
        }

        socket.on('error', (error) => {
            console.log('error socket:', error);
        });
        socket.on('disconnect', () => {
            delete users[userID];
            console.log(`user ${socket.id} disconnected`);
        });
    });
};

module.exports = initSocket;
