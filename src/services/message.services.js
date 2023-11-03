const db = require('../models');
const { Op } = require('sequelize');
const ErrorsWithStatus = require('../constants/Error');
const HTTP_STATUS = require('../constants/httpStatus');

class MessageServices {
    async addMessage(id_reciever, id_sender, content) {
        await db.Message.create({
            id_reciever: id_reciever,
            id_sender: id_sender,
            content: content,
        });
        return {
            success: true,
            message: 'send message successfully',
        };
    }
    async getConversationList(userID) {
        const conversations = await db.Message.findAll({
            where: {
                [Op.or]: [
                    {
                        id_reciever: userID,
                    },
                    {
                        id_sender: userID,
                    },
                ],
            },
            attributes: [
                [db.sequelize.literal('DISTINCT `id_reciever`'), 'id'],
                [db.sequelize.literal('MAX(`createdAt`)'), 'last_message_time'],
            ],
            include: [
                {
                    model: db.User,
                    as: 'receiver',
                    attributes: ['id', 'username', 'avatar'],
                },
                {
                    model: db.User,
                    as: 'sender',
                    attributes: ['id', 'username', 'avatar'],
                },
            ],
            group: ['id_reciever'],
            order: [[db.sequelize.literal('last_message_time'), 'DESC']],
        });
        return {
            success: true,
            conversations: conversations,
        };
    }
    async getConversationOfAnUser(userID, chat_user_ID, page, limit) {
        const messages = await db.Message.findAll({
            where: {
                [Op.or]: [
                    {
                        id_reciever: userID,
                        id_sender: chat_user_ID,
                    },
                    {
                        id_reciever: chat_user_ID,
                        id_sender: userID,
                    },
                ],
            },
            offset: (page - 1) * limit,
            limit: limit,
            order: [['createdAt', 'ASC']],
        });
        return {
            success: true,
            messages: messages,
        };
    }
}

module.exports = new MessageServices();
