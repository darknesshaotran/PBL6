const db = require('../models');
const { Op } = require('sequelize');
const ErrorsWithStatus = require('../constants/Error');
const HTTP_STATUS = require('../constants/httpStatus');

class MessageServices {
    async addMessage(star, comment, userID, id_shoes) {}
    async getConversationList(userID) {}
    async getConversationOfAnUser(userID, chat_user_ID) {}
}

module.exports = new MessageServices();
