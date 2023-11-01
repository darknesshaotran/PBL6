const { Server } = require('socket.io');
const { ErrorsWithStatus } = require('../models/Errors');
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
    // SERVER INSTANCE MIDDLEWARE
    io.use(async (socket, next) => {
        const Authorization = socket.handshake.auth.Authorization;
        try {
            if (!Authorization) {
                throw new ErrorsWithStatus({
                    message: USERS_MESSAGES.ACCESS_TOKEN_REQUIRED,
                    status: HTTP_STATUS.UNAUTHORIZED,
                });
            }
            const accessToken = Authorization.split(' ')[1];
            const decoded_authorization = await verifyToken(accessToken);

            socket.handshake.auth.decoded_authorization = decoded_authorization;
            socket.handshake.auth.accessToken = accessToken;
            next();
        } catch (error) {
            return next({
                message: 'unauthorized',
                name: 'unauthorized_error',
                data: error,
            });
        }
    });
    io.on('connection', (socket) => {
        // console.log(socket.handshake.auth)
        const user_id = socket.handshake.auth.decoded_authorization.userId;
        users[user_id] = {
            socket_id: socket.id,
        };
        // console.log('user connected')
        // SOCKET INSTANCE MIDDLEWARE
        socket.use(async (pack, next) => {
            const accessToken = socket.handshake.auth.accessToken;
            try {
                await verifyToken(accessToken);
                next();
            } catch (error) {
                next(new Error('Unauthorized'));
            }
        });
        socket.on('error', (error) => {
            console.log('error socket:', error);
        });
        socket.on('sendMessage', async (data) => {
            const { payload } = data;
            const receiver_socket_id = users[payload.receiver_id]?.socket_id;
            const conversation = new Conversation({
                sender_id: new ObjectId(payload.sender_id),
                receiver_id: new ObjectId(payload.receiver_id),
                content: payload.content,
            });
            const result = await databaseService.conversations.insertOne(conversation);
            conversation._id = result.insertedId;
            if (receiver_socket_id) {
                socket.to(receiver_socket_id).emit('receive_Message', { payload: conversation });
            }
        });
        socket.on('disconnect', () => {
            delete users[user_id];
            console.log(`user ${socket.id} disconnected`);
            // console.log(users)
        });
    });
};

module.exports = initSocket;
