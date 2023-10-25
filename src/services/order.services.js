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
            id_status: 1,
        });
        var totalPrice = 0;
        for (let i = 0; i < cartItems.length; i++) {
            await this.createOrderItem(cartItems[i], order);
            totalPrice += cartItems[i].price * cartItems[i].quantity;
            await db.Cart_Item.destroy({
                where: { id: cartItems[i].id_cartItem },
            });
        }
        // console.log(totalPrice);
        await db.Order.update(
            {
                totalPrice: totalPrice,
            },
            {
                where: { id: order.id },
            },
        );
        return {
            success: true,
            message: 'create Order with cart successfully',
        };
    }
    async createOneItemOrder(Item, userID) {
        const order = await db.Order.create({
            id_account: userID,
            id_status: 1,
        });
        await this.createOrderItem(Item, order);
        totalPrice += Item.price * Item.quantity;
        await db.Order.update(
            {
                totalPrice: totalPrice,
            },
            {
                where: {
                    id: order.id,
                },
            },
        );
        return {
            success: true,
            message: "create one item 's order successfully",
        };
    }

    async OrderDetails(id_order) {
        const order = await db.Order.findOne({
            where: { id: id_order },
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
            },
            include: [
                {
                    model: db.Shoes,
                    through: {
                        attributes: ['quantity', 'fixed_price'],
                        as: 'order_item_infor',
                    },
                    as: 'Order_items',
                    attributes: ['id', 'name', 'price', 'size', 'color'],
                },
                { model: db.Status, as: 'Status', attributes: ['status'] },
            ],
        });

        ////////////////////////////////////////////////////////////////
        if (!order) throw new ErrorsWithStatus({ status: HTTP_STATUS.NOT_FOUND, message: 'Order not found' });
        var totalPrice = 0;

        for (let i = 0; i < order.Order_items.length; i++) {
            totalPrice += order.Order_items[i].order_item_infor.fixed_price;
        }
        const Order = JSON.parse(JSON.stringify(order));
        return {
            success: true,
            result: { ...Order, totalPrice },
        };
    }
    async HistoryOrder(userID) {
        const order = await db.Order.findAll({
            where: { id_account: userID },
            include: [
                {
                    model: db.Shoes,
                    through: {
                        attributes: ['quantity', 'fixed_price'],
                        as: 'order_item_infor',
                    },
                    as: 'Order_items',
                    attributes: ['id', 'name', 'price', 'size', 'color'],
                },
                { model: db.Status, as: 'Status', attributes: ['status'] },
            ],
        });
        return {
            success: true,
            result: order,
        };
    }
}
module.exports = new OrderServices();
