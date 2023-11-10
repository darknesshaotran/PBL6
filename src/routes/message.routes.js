const { Router } = require('express');
const { wrapController } = require('../utils/handle');
const { accessTokenValidator, refreshTokenValidator } = require('../middlewares/user.middlewares.js');
const messageControllers = require('../controllers/message.controllers');
const { UserExistValidator } = require('../middlewares/message.middlewares.js');
const router = Router();
router.get(
    '/:chat_user_ID',
    accessTokenValidator,
    UserExistValidator,
    wrapController(messageControllers.getConversationOfAnUser),
);
router.get('/', accessTokenValidator, wrapController(messageControllers.getConversationList));

module.exports = router;
