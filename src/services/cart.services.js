const db = require('../models');
const { Op } = require('sequelize');
const ErrorsWithStatus = require('../constants/Error');
const HTTP_STATUS = require('../constants/httpStatus');

class CartServices {
    async addToCart(userID, id_shoes, quantity) {
        const cart = await db.Cart.findOne({ where: { id_account: userID } });

        const cart_item = await db.Cart_Item.findOne({
            where: {
                id_shoes: id_shoes,
                id_cart: cart.id,
            },
        });
        if (cart_item) {
            await db.Cart_Item.update(
                { quantity: Number(cart_item.quantity) + Number(quantity) },
                {
                    where: {
                        id_shoes: id_shoes,
                        id_cart: cart.id,
                    },
                },
            );
            return {
                success: true,
                message: 'update quantity successfully',
            };
        }
        await db.Cart_Item.create({
            id_shoes: id_shoes,
            id_cart: cart.id,
            quantity: quantity,
        });
        return {
            success: true,
            message: 'added to cart successfully',
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
                        attributes: ['quantity', 'id'],
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
    async updateQuantityItem(userID, quantity, id_shoes) {
        const cart = await db.Cart.findOne({ where: { id_account: userID } });
        if (quantity === 0) {
            await db.Cart_Item.destroy({
                where: {
                    id_shoes: id_shoes,
                    id_cart: cart.id,
                },
            });
            return {
                success: true,
                message: 'delete item already',
            };
        }
        await db.Cart_Item.update(
            { quantity: quantity },
            {
                where: {
                    id_shoes: id_shoes,
                    id_cart: cart.id,
                },
            },
        );
        return {
            success: true,
            message: 'update quantity successfully',
        };
    }
    async deleteQuantityItem(id_cartItem) {
        await db.Cart_Item.destroy({
            where: { id: id_cartItem },
        });
        return {
            success: true,
            message: 'delete shoes successfully',
        };
    }
}
module.exports = new CartServices();
