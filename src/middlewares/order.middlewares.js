const { checkSchema } = require('express-validator');
const HTTP_STATUS = require('../constants/httpStatus');
const ErrorsWithStatus = require('../constants/Error');
const validate = require('../utils/validation');
const db = require('../models');
const USERS_MESSAGES = require('../constants/messages');

const checkOrderExistsValidator = checkSchema(
    {
        id_order: {
            custom: {
                options: async (value) => {
                    const order = await db.Order.findOne({
                        where: {
                            id: value,
                        },
                        attributes: {
                            exclude: ['createdAt', 'updatedAt'],
                        },
                    });
                    if (!order) {
                        throw new ErrorsWithStatus({ status: HTTP_STATUS.NOT_FOUND, message: 'order not found' });
                    }
                    return true;
                },
            },
        },
    },
    ['params'],
);
const checkStatusExistsValidator = checkSchema(
    {
        id_status: {
            custom: {
                options: async (value) => {
                    const status = await db.Status.findOne({
                        where: {
                            id: value,
                        },
                        attributes: {
                            exclude: ['createdAt', 'updatedAt'],
                        },
                    });
                    if (!status) {
                        throw new ErrorsWithStatus({ status: HTTP_STATUS.NOT_FOUND, message: 'status not found' });
                    }
                    return true;
                },
            },
        },
    },
    ['params'],
);
const checkItemOrderValidator = checkSchema(
    {
        Item: {
            custom: {
                options: async (value) => {
                    const { id_shoes, quantity, price } = value;
                    const shoes = await db.Shoes.findOne({
                        where: {
                            id: id_shoes,
                        },
                        attributes: {
                            exclude: ['createdAt', 'updatedAt'],
                        },
                    });
                    if (!shoes) {
                        throw new ErrorsWithStatus({ status: HTTP_STATUS.NOT_FOUND, message: 'shoes not found' });
                    }
                    if (isNaN(quantity)) {
                        throw new ErrorsWithStatus({
                            status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
                            message: 'quantity must be a number',
                        });
                    }
                    if (Number(price) !== Number(shoes.price)) {
                        throw new ErrorsWithStatus({
                            status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
                            message: 'price is not correct',
                        });
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
        address: {
            notEmpty: {
                errorMessage: 'address is required',
            },
        },
    },
    ['body'],
);
exports.OrderExistsValidator = validate(checkOrderExistsValidator);
exports.StatusExistsValidator = validate(checkStatusExistsValidator);
exports.ItemOrderValidator = validate(checkItemOrderValidator);
