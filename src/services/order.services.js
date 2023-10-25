const db = require('../models');
const { Op } = require('sequelize');
const ErrorsWithStatus = require('../constants/Error');
const Account = require('../models/account');
const inforUser = require('../models/inforuser');
const hashPassword = require('../utils/crypto');
const USERS_MESSAGES = require('../constants/messages');
const { signAccessToken, signReFreshToken, verifyToken, signForgotPasswordToken } = require('../utils/JWT');
const HTTP_STATUS = require('../constants/httpStatus');

class OrderServices {
    async createOrderItem(Item, order) {
        await db.Order_Item.create({
            id_shoes: Item.id_shoes,
            id_order: order.id,
            quantity: Item.quantity,
            fixed_price: Item.price * Item.quantity,
        });
        const shoes = await db.Shoes.findOne({ where: { id: Item.id_shoes } });
        await db.Shoes.update(
            {
                amount: Number(shoes.amount) - Number(Item.quantity),
            },
            {
                where: { id: shoes.id },
            },
        );
    }
    async createOrderWithCartItem(cartItems, userID) {
        const order = await db.Order.create({
            id_account: userID,
            id_status: 3,
        });

        for (let i = 0; i < cartItems.length; i++) {
            await this.createOrderItem(cartItems[i], order);
            await db.Cart_Item.destroy({
                where: { id: cartItems[i].id_cartItem },
            });
        }
        return {
            success: true,
            message: 'create Order with cart successfully',
        };
    }
    async createOneItemOrder(Item, userID) {
        const order = await db.Order.create({
            id_account: userID,
            id_status: 3,
        });
        await this.createOrderItem(Item, order);
        return {
            success: true,
            message: "create one item 's order successfully",
        };
    }
}
module.exports = new OrderServices();
