const db = require('../models');
const { Op } = require('sequelize');
const ErrorsWithStatus = require('../constants/Error');
const Account = require('../models/account');
const inforUser = require('../models/inforuser');
const hashPassword = require('../utils/crypto');
const USERS_MESSAGES = require('../constants/messages');
const { signAccessToken, signReFreshToken, verifyToken, signForgotPasswordToken } = require('../utils/JWT');
const HTTP_STATUS = require('../constants/httpStatus');

class CartServices {
    async addToCart(userID, id_shoes, quantity) {
        const cart = await db.Cart.findOne({ where: { id_account: userID } });
        await db.Cart_Item.create({
            id_shoes: id_shoes,
            id_cart: cart.id,
            quantity: quantity,
        });
        // const shoes = await db.Shoes.findOne({ where: { id: id_shoes } });
        // await db.Shoes.update({
        //     amount: shoes.amount - quantity,
        // });
        return {
            success: true,
            messsage: 'added to cart successfully',
        };
    }
    async getCartDetails(userID) {
        const Cart = await db.Cart.findOne({
            where: { id_account: userID },
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
            },
            include: [
                {
                    model: db.Shoes,
                    through: {
                        attributes: ['quantity'],
                        as: 'cart_item_infor',
                    },
                    as: 'Cart_Items',
                    attributes: ['id', 'name', 'price', 'size', 'color'],
                },
            ],
        });
        return {
            success: true,
            Cart: Cart,
        };
    }
}
module.exports = new CartServices();
