const db = require('../models');
const { Op } = require('sequelize');
const ErrorsWithStatus = require('../constants/Error');
const HTTP_STATUS = require('../constants/httpStatus');

class CartServices {
    async addToCart(userID, id_size_item, quantity) {
        const cart = await db.Cart.findOne({ where: { id_account: userID } });

        const cart_item = await db.Cart_Item.findOne({
            where: {
                id_size_item: id_size_item,
                id_cart: cart.id,
            },
        });
        if (cart_item) {
            await db.Cart_Item.update(
                { quantity: Number(cart_item.quantity) + Number(quantity) },
                {
                    where: {
                        id_cart: cart.id,
                        id_size_item: id_size_item,
                    },
                },
            );
            return {
                success: true,
                message: 'update quantity successfully',
            };
        }
        await db.Cart_Item.create({
            id_size_item: id_size_item,
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
                    model: db.Size_Item,
                    through: {
                        attributes: ['quantity', 'id'],
                        as: 'cart_item_infor',
                    },
                    as: 'Cart_Items',
                    attributes: ['id', 'amount', 'size'],
                    include: [{ model: db.Shoes, as: 'Shoes', attributes: ['id', 'name', 'price'] }],
                },
            ],
        });
        const cart = JSON.parse(JSON.stringify(Cart));
        for (let i = 0; i < cart.Cart_Items.length; i++) {
            const image = await db.Image.findOne({
                where: { id_shoes: cart.Cart_Items[i].Shoes.id },
                attributes: ['image'],
            });
            cart.Cart_Items[i].Shoes.Image = image.image ? image.image : '';
        }
        return {
            success: true,
            Cart: cart,
        };
    }
    async updateQuantityItem(userID, quantity, id_cartItem) {
        if (quantity === 0) {
            await db.Cart_Item.destroy({
                where: {
                    id: id_cartItem,
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
                    id: id_cartItem,
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
