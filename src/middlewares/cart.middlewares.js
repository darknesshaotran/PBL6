const { checkSchema } = require('express-validator');
const HTTP_STATUS = require('../constants/httpStatus');
const ErrorsWithStatus = require('../constants/Error');
const db = require('../models');
const { wrapController } = require('../utils/handle');
const validate = require('../utils/validation');

const checkAddToCartValidator = checkSchema(
    {
        id_size_item: {
            notEmpty: {
                errorMessage: 'id_size_item is required',
            },
            custom: {
                options: async (value) => {
                    const shoes = await db.Size_Item.findOne({
                        where: {
                            id: value,
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
                    return true;
                },
            },
        },

        quantity: {
            isNumeric: {
                errorMessage: 'quantity must be a number',
            },
            custom: {
                options: async (value, { req }) => {
                    const shoes = await db.Size_Item.findOne({
                        where: {
                            id: req.body.id_size_item,
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
                    if (Number(value) > shoes.amount) {
                        throw {
                            status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
                            message: "quantity must be a lower than shoes's amount",
                        };
                    }

                    return true;
                },
            },
        },
    },

    ['body'],
);
const checkUpdateCartItemQuantityValidator = checkSchema(
    {
        id_cartItem: {
            custom: {
                options: async (value) => {
                    const shoes = await db.Cart_Item.findOne({
                        where: {
                            id: value,
                        },
                        attributes: {
                            exclude: ['id_category', 'id_brand', 'createdAt', 'updatedAt'],
                        },
                    });
                    if (!shoes) {
                        throw { status: HTTP_STATUS.NOT_FOUND, message: 'item not found' };
                    }
                    return true;
                },
            },
        },
        quantity: {
            isNumeric: {
                errorMessage: 'quantity must be a number',
            },
        },
    },

    ['params', 'body'],
);

const checkDeleteCartItemValidator = checkSchema(
    {
        id_cartItem: {
            custom: {
                options: async (value) => {
                    const cart_item = await db.Cart_Item.findOne({
                        where: {
                            id: value,
                        },
                        attributes: {
                            exclude: ['id_category', 'id_brand', 'createdAt', 'updatedAt'],
                        },
                    });
                    if (!cart_item) {
                        throw { status: HTTP_STATUS.NOT_FOUND, message: 'cart item not found' };
                    }
                    return true;
                },
            },
        },
    },

    ['params'],
);

exports.AddToCartValidator = validate(checkAddToCartValidator);
exports.UpdateCartItemQuantityValidator = validate(checkUpdateCartItemQuantityValidator);
exports.DeleteCartItemValidator = validate(checkDeleteCartItemValidator);
