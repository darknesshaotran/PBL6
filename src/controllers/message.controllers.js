const messageServices = require('../services/message.services');

class MessageController {
    async getConversationOfAnUser(req, res, next) {
        const { decoded_authorization } = req;
        const userID = decoded_authorization.userID;
        const { chat_user_ID } = req.params;
        const { page, limit } = req.query;
        const result = await messageServices.getConversationOfAnUser(userID, chat_user_ID, Number(page), Number(limit));
        res.json(result);
    }
    async getConversationList(req, res, next) {
        const { decoded_authorization } = req;
        const userID = decoded_authorization.userID;
        const { page, limit } = req.query;
        const result = await messageServices.getConversationList(userID, Number(page), Number(limit));
        res.json(result);
    }
}
module.exports = new MessageController();
