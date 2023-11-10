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
    async getConversationList(userID, page, limit) {
        const conversations = await db.Message.findAll({
            where: db.sequelize.literal(
                `Message.id IN (SELECT MAX(Messages.id) FROM Messages WHERE (id_reciever = ${userID} OR id_sender = ${userID}))`,
            ),

            attributes: ['id', 'content', 'createdAt'],
            include: [
                {
                    model: db.Account,
                    as: 'sender',
                    attributes: {
                        exclude: ['password', 'forgot_password_token', 'id_role', 'createdAt', 'updatedAt'],
                    },
                    include: [
                        {
                            model: db.inforUser,
                            as: 'inforUser',
                            attributes: ['firstname', 'lastname', 'phoneNumber', 'avatar'],
                        },
                    ],
                },
                {
                    model: db.Account,
                    as: 'reciever',
                    attributes: {
                        exclude: ['password', 'forgot_password_token', 'id_role', 'createdAt', 'updatedAt'],
                    },
                    include: [
                        {
                            model: db.inforUser,
                            as: 'inforUser',
                            attributes: ['firstname', 'lastname', 'phoneNumber', 'avatar'],
                        },
                    ],
                },
            ],
            offset: (page - 1) * limit,
            limit: limit,
            group: ['id_reciever'],
            order: [[db.sequelize.literal('createdAt'), 'DESC']],
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
        const conversation = JSON.parse(JSON.stringify(messages));
        for (let i = 0; i < conversation.length; i++) {
            if (conversation[i].id_reciever == userID && conversation[i].id_sender == chat_user_ID) {
                const User = await db.Account.findOne({
                    where: { id: chat_user_ID },
                    attributes: {
                        exclude: ['password', 'forgot_password_token', 'id_role', 'createdAt', 'updatedAt'],
                    },
                    include: [
                        { model: db.Role, as: 'Role', attributes: ['id', 'roleName'] },
                        {
                            model: db.inforUser,
                            as: 'inforUser',
                            attributes: ['firstname', 'lastname', 'avatar'],
                        },
                    ],
                });
                conversation[i].chatUser = User;
            }
        }
        return {
            success: true,
            messages: conversation,
        };
    }
}

module.exports = new MessageServices();
