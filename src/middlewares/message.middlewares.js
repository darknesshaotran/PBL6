const { checkSchema } = require('express-validator');
const HTTP_STATUS = require('../constants/httpStatus');
const USERS_MESSAGES = require('../constants/messages');
const ErrorsWithStatus = require('../constants/Error');
const db = require('../models');
const validate = require('../utils/validation');
const checkUserExistValidator = checkSchema(
    {
        chat_user_ID: {
            custom: {
                options: async (value, { req }) => {
                    const user = await db.Account.findOne({
                        where: { id: value },
                    });
                    if (!user) {
                        throw {
                            message: USERS_MESSAGES.USER_NOT_FOUND,
                            status: HTTP_STATUS.NOT_FOUND,
                        };
                    }
                    return true;
                },
            },
        },
    },
    ['params'],
);
exports.UserExistValidator = validate(checkUserExistValidator);
