const { checkSchema } = require('express-validator');
const HTTP_STATUS = require('../constants/httpStatus');
const ErrorsWithStatus = require('../constants/Error');
const validate = require('../utils/validation');
const db = require('../models');
const USERS_MESSAGES = require('../constants/messages');
const { wrapController } = require('../utils/handle');

const checkPaymentInforValidator = checkSchema(
    {
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
const checkItemsValidator = async (req, res, next) => {
    const { items, size_items, cart_size_items } = req.body;
    if (!items) {
        throw new ErrorsWithStatus({ status: HTTP_STATUS.BAD_REQUEST, message: 'items is required for stripe' });
    }

    if (size_items) {
        const { id_size_item, quantity, price } = size_items;
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
            throw new ErrorsWithStatus({ status: HTTP_STATUS.NOT_FOUND, message: 'item not found' });
        }
        if (isNaN(quantity)) {
            throw new ErrorsWithStatus({
                status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
                message: 'quantity must be a number',
            });
        }
        if (quantity > shoes.amount) {
            throw new ErrorsWithStatus({
                status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
                message: "quantity must be a lower than shoes's amount",
            });
        }
        if (Number(price) !== Number(shoes.Shoes.price)) {
            console.log(price, shoes.Shoes.price);
            throw new ErrorsWithStatus({
                status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
                message: 'price is not correct',
            });
        }
    }
    if (cart_size_items) {
        for (let i = 0; i < cart_size_items.length; i++) {
            const { id_size_item, quantity, price, id_cartItem } = cart_size_items[i];
            const cart_Item = await db.Cart_Item.findOne({
                where: { id: id_cartItem },
            });
            if (!cart_Item) {
                throw new ErrorsWithStatus({
                    status: HTTP_STATUS.NOT_FOUND,
                    message: 'cart item not found',
                });
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
                throw new ErrorsWithStatus({ status: HTTP_STATUS.NOT_FOUND, message: 'item not found' });
            }
            if (isNaN(quantity)) {
                throw new ErrorsWithStatus({
                    status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
                    message: 'quantity must be a number',
                });
            }
            if (quantity > shoes.amount) {
                throw new ErrorsWithStatus({
                    status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
                    message: "quantity must be a lower than shoes's amount",
                });
            }
            if (Number(price) !== Number(shoes.Shoes.price)) {
                console.log(price, shoes.Shoes.price);
                throw new ErrorsWithStatus({
                    status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
                    message: 'price is not correct',
                });
            }
        }
    }
    next();
};

exports.paymentInforValidator = validate(checkPaymentInforValidator);
exports.itemsValidator = wrapController(checkItemsValidator);
