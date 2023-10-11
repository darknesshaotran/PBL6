const { checkSchema } = require('express-validator');
const HTTP_STATUS = require('../constants/httpStatus');
const USERS_MESSAGES = require('../constants/messages');
const ErrorsWithStatus = require('../constants/Error');
const hashPassword = require('../utils/crypto');
const { verifyToken } = require('../utils/JWT');
const validate = require('../utils/validation');
const userServices = require('../services/user.services');
const db = require('../models');
const checkRegisterValidator = checkSchema(
    {
        firstname: {
            notEmpty: {
                errorMessage: USERS_MESSAGES.NAME_IS_REQUIRED,
            },
            isString: {
                errorMessage: USERS_MESSAGES.NAME_MUST_BE_STRING,
            },
            isLength: {
                options: {
                    max: 50,
                    min: 1,
                },
                errorMessage: USERS_MESSAGES.NAME_LENGTH_FROM_1_TO_50,
            },
            trim: true,
        },
        lastname: {
            notEmpty: {
                errorMessage: USERS_MESSAGES.NAME_IS_REQUIRED,
            },
            isString: {
                errorMessage: USERS_MESSAGES.NAME_MUST_BE_STRING,
            },
            isLength: {
                options: {
                    max: 50,
                    min: 1,
                },
                errorMessage: USERS_MESSAGES.NAME_LENGTH_FROM_1_TO_50,
            },
            trim: true,
        },
        email: {
            isEmail: {
                errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID,
            },
            notEmpty: {
                errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED,
            },
            trim: true,
            custom: {
                options: async (value) => {
                    const isExistEmail = await userServices.isEmailExist(value);
                    if (isExistEmail) {
                        throw new Error(USERS_MESSAGES.EMAIL_ALREADY_EXISTS);
                    }
                    return true;
                },
            },
        },
        password: {
            notEmpty: {
                errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED,
            },
            isString: {
                errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRING,
            },
            isStrongPassword: {
                options: {
                    minLength: 8,
                    minLowercase: 1,
                    minUppercase: 0,
                    minNumbers: 1,
                    minSymbols: 0,
                },
                errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG,
            },
        },
        confirm_password: {
            notEmpty: {
                errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED,
            },
            isString: {
                errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_STRING,
            },
            custom: {
                options: (value, { req }) => {
                    if (value !== req.body.password) {
                        throw new Error(USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD);
                    }
                    return true;
                },
            },
        },
        phoneNumber: {
            notEmpty: {
                errorMessage: USERS_MESSAGES.PHONENUMBER_IS_REQUIRED,
            },
            isString: {
                errorMessage: USERS_MESSAGES.PHONENUMBER_MUST_BE_STRING,
            },
            isMobilePhone: {
                errorMessage: 'Phone number is invalid',
            },
        },
    },
    ['body'],
);

const checkLoginValidator = checkSchema(
    {
        email: {
            isEmail: {
                errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID,
            },
            notEmpty: {
                errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED,
            },
            custom: {
                options: async (value, { req }) => {
                    const user = await userServices.findUserLogin(value, req.body.password);
                    req.user = user;
                    return true;
                },
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

const checkAccessTokenValidator = checkSchema(
    {
        Authorization: {
            custom: {
                options: async (value, { req }) => {
                    if (!value) {
                        throw new ErrorsWithStatus({
                            message: USERS_MESSAGES.ACCESS_TOKEN_REQUIRED,
                            status: HTTP_STATUS.UNAUTHORIZED,
                        });
                    }
                    const accessToken = value.split(' ')[1];
                    const decoded_authorization = await verifyToken(accessToken);
                    req.decoded_authorization = decoded_authorization;
                    return true;
                },
            },
        },
    },
    ['headers'],
);
const checkRefreshTokenValidator = checkSchema(
    {
        refreshToken: {
            custom: {
                options: async (value, { req }) => {
                    if (!value) {
                        throw new ErrorsWithStatus({
                            message: USERS_MESSAGES.REFRESH_TOKEN_REQUIRED,
                            status: HTTP_STATUS.UNAUTHORIZED,
                        });
                    }
                    const decoded_refresh_token = await verifyToken(value);
                    // const Refresh_token = await databaseService.refreshTokens.findOne({ token: value });
                    const refreshToken = await db.refreshToken.findOne({ where: { refreshToken: value } });
                    if (refreshToken === null) {
                        throw new ErrorsWithStatus({
                            message: USERS_MESSAGES.USED_REFRESH_TOKEN_OR_NOT_EXIST,
                            status: HTTP_STATUS.UNAUTHORIZED,
                        });
                    }
                    req.decoded_refresh_token = decoded_refresh_token;
                    return true;
                },
            },
        },
    },
    ['body'],
);
const checkForgotPasswordValidator = checkSchema(
    {
        email: {
            isEmail: {
                errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID,
            },
            custom: {
                options: async (value, { req }) => {
                    const user = await db.Account.findOne({ where: { email: value } });
                    if (user === null) {
                        throw new Error(USERS_MESSAGES.USER_NOT_FOUND);
                    }
                    req.user = user;
                    return true;
                },
            },
        },
    },
    ['body'],
);
const checkVerifyForgotPasswordTokenValidator = checkSchema(
    {
        forgot_password_token: {
            trim: true,
            custom: {
                options: async (value, { req }) => {
                    if (!value) {
                        throw new ErrorsWithStatus({
                            message: USERS_MESSAGES.FORGOT_PASSWORD_TOKEN_REQUIRED,
                            status: HTTP_STATUS.UNAUTHORIZED,
                        });
                    }
                    const decoded_forgot_password_token = await verifyToken(value);
                    const user = await db.Account.findOne({ where: { id: decoded_forgot_password_token.userID } });
                    if (!user) {
                        throw new ErrorsWithStatus({
                            message: USERS_MESSAGES.USER_NOT_FOUND,
                            status: HTTP_STATUS.UNAUTHORIZED,
                        });
                    }
                    if (user.forgot_password_token !== value) {
                        throw new ErrorsWithStatus({
                            message: USERS_MESSAGES.FORGOT_PASSWORD_TOKEN_INVALID,
                            status: HTTP_STATUS.UNAUTHORIZED,
                        });
                    }
                    return true;
                },
            },
        },
    },
    ['body'],
);

const checkResetPasswordValidator = checkSchema(
    {
        password: {
            notEmpty: {
                errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED,
            },
            isString: {
                errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRING,
            },
            isStrongPassword: {
                options: {
                    minLength: 8,
                    minLowercase: 1,
                    minUppercase: 0,
                    minNumbers: 1,
                    minSymbols: 0,
                },
                errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG,
            },
        },
        confirm_password: {
            notEmpty: {
                errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED,
            },
            isString: {
                errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_STRING,
            },
            custom: {
                options: (value, { req }) => {
                    if (value !== req.body.password) {
                        throw new Error(USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD);
                    }
                    return true;
                },
            },
        },
        forgot_password_token: {
            trim: true,
            custom: {
                options: async (value, { req }) => {
                    if (!value) {
                        throw new ErrorsWithStatus({
                            message: USERS_MESSAGES.FORGOT_PASSWORD_TOKEN_REQUIRED,
                            status: HTTP_STATUS.UNAUTHORIZED,
                        });
                    }
                    const decoded_forgot_password_token = await verifyToken(value);
                    const user = await db.Account.findOne({ where: { id: decoded_forgot_password_token.userID } });
                    if (!user) {
                        throw new ErrorsWithStatus({
                            message: USERS_MESSAGES.USER_NOT_FOUND,
                            status: HTTP_STATUS.UNAUTHORIZED,
                        });
                    }
                    if (user.forgot_password_token !== value) {
                        throw new ErrorsWithStatus({
                            message: USERS_MESSAGES.FORGOT_PASSWORD_TOKEN_INVALID,
                            status: HTTP_STATUS.UNAUTHORIZED,
                        });
                    }
                    req.decoded_forgot_password_token = decoded_forgot_password_token;
                    return true;
                },
            },
        },
    },
    ['body'],
);
exports.registerValidator = validate(checkRegisterValidator);
exports.loginValidator = validate(checkLoginValidator);
exports.accessTokenValidator = validate(checkAccessTokenValidator);
exports.refreshTokenValidator = validate(checkRefreshTokenValidator);
exports.forgotPasswordValidator = validate(checkForgotPasswordValidator);
exports.VerifyForgotPasswordTokenValidator = validate(checkVerifyForgotPasswordTokenValidator);
exports.ResetPasswordValidator = validate(checkResetPasswordValidator);
