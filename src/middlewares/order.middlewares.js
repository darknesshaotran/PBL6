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
                options: async (value, { req }) => {
                    const order = await db.Order.findOne({
                        where: {
                            id: value,
                        },
                        attributes: {
                            exclude: ['createdAt', 'updatedAt'],
                        },
                    });

                    if (!order) {
                        throw { status: HTTP_STATUS.NOT_FOUND, message: 'order not found' };
                    }
                    const { decoded_authorization } = req;
                    const { role } = decoded_authorization;
                    if (role != 'admin') {
                        const customersID = order.id_account;
                        const { decoded_authorization } = req;
                        const userID = decoded_authorization.userID;
                        if (customersID != userID) {
                            throw { status: HTTP_STATUS.UNAUTHORIZED, message: "you are not order's owner" };
                        }
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
                        throw new { status: HTTP_STATUS.NOT_FOUND, message: 'status not found' }();
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
                    const { id_size_item, quantity, price } = value;
                    const shoes = await db.Size_Item.findOne({
                        where: {
                            id: id_size_item,
                        },
                        attributes: {
                            exclude: ['createdAt', 'updatedAt'],
                        },
                        include: [
                            {
                                model: db.Shoes,
                                attributes: ['id', 'name', 'price'],
                                as: 'Shoes',
                            },
                        ],
                    });
                    if (!shoes) {
                        throw { status: HTTP_STATUS.NOT_FOUND, message: 'item not found' };
                    }
                    if (isNaN(quantity)) {
                        throw {
                            status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
                            message: 'quantity must be a number',
                        };
                    }
                    if (quantity > shoes.amount) {
                        throw {
                            status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
                            message: "quantity must be a lower than shoes's amount",
                        };
                    }
                    if (Number(price) !== Number(shoes.Shoes.price)) {
                        console.log(price, shoes.Shoes.price);
                        throw {
                            status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
                            message: 'price is not correct',
                        };
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
const checkCartItemOrderValidator = checkSchema(
    {
        cartItems: {
            custom: {
                options: async (value) => {
                    for (let i = 0; i < value.length; i++) {
                        const { id_size_item, quantity, price, id_cartItem } = value[i];
                        const cart_Item = await db.Cart_Item.findOne({
                            where: { id: id_cartItem },
                        });
                        if (!cart_Item) {
                            throw {
                                status: HTTP_STATUS.NOT_FOUND,
                                message: 'cart item not found',
                            };
                        }
                        const shoes = await db.Size_Item.findOne({
                            where: { id: id_size_item },
                            attributes: {
                                exclude: ['createdAt', 'updatedAt'],
                            },
                            include: [
                                {
                                    model: db.Shoes,
                                    attributes: ['id', 'name', 'price'],
                                    as: 'Shoes',
                                },
                            ],
                        });
                        if (!shoes) {
                            throw { status: HTTP_STATUS.NOT_FOUND, message: 'item not found' };
                        }
                        if (isNaN(quantity)) {
                            throw {
                                status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
                                message: 'quantity must be a number',
                            };
                        }
                        if (quantity > shoes.amount) {
                            throw {
                                status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
                                message: "quantity must be a lower than shoes's amount",
                            };
                        }
                        if (Number(price) !== Number(shoes.Shoes.price)) {
                            console.log(price, shoes.Shoes.price);
                            throw {
                                status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
                                message: 'price is not correct',
                            };
                        }
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
exports.CartItemOrderValidator = validate(checkCartItemOrderValidator);
