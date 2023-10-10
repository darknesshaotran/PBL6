const { checkSchema } = require('express-validator');
const HTTP_STATUS = require('../constants/httpStatus');
const USERS_MESSAGES = require('../constants/messages');
const ErrorsWithStatus = require('../constants/Error');
const hashPassword = require('../utils/crypto');
const { verifyToken } = require('../utils/JWT');
const validate = require('../utils/validation');

const checkLoginValidator = checkSchema(
    {
        email: {
            isEmail: {
                errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID,
            },
            notEmpty: {
                errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED,
            },
        },
        password: {
            notEmpty: {
                errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED,
            },
        },
    },
    ['body'],
);

exports.loginValidator = validate(checkLoginValidator);

// exports.loginValidator = validate(checkLoginValidator)
