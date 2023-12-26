const db = require('../models');
const { Op } = require('sequelize');
const ErrorsWithStatus = require('../constants/Error');
const HTTP_STATUS = require('../constants/httpStatus');

class OrderServices {
    async createOrderItem(Item, order) {
        await db.Order_Item.create({
            id_size_item: Item.id_size_item,
            id_order: order.id,
            quantity: Item.quantity,
            fixed_price: Item.price * Item.quantity,
            isRate: 0,
        });
        const size_Item = await db.Size_Item.findOne({ where: { id: Item.id_size_item } });
        await db.Size_Item.update(
            {
                amount: Number(size_Item.amount) - Number(Item.quantity),
            },
            {
                where: { id: size_Item.id },
            },
        );
    }
    async createOrderWithCartItem(cartItems, userID, address, phoneNumber) {
        const order = await db.Order.create({
            id_account: userID,
            id_status: 1,
            order_address: address,
            order_phoneNumber: phoneNumber,
        });
        var totalPrice = 0;
        for (let i = 0; i < cartItems.length; i++) {
            await this.createOrderItem(cartItems[i], order);
            totalPrice += cartItems[i].price * cartItems[i].quantity;
            await db.Cart_Item.destroy({
                where: { id: cartItems[i].id_cartItem },
            });
        }
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
            order: order,
        };
    }
    async createOneItemOrder(Item, userID, address, phoneNumber) {
        const order = await db.Order.create({
            id_account: userID,
            id_status: 1,
            order_address: address,
            order_phoneNumber: phoneNumber,
        });
        var totalPrice = 0;
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
            order: order,
        };
    }
    async OrderDetails(id_order) {
        const Order = await db.Order.findOne({
            where: { id: id_order },
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
            },
            include: [
                {
                    model: db.Size_Item,
                    through: {
                        attributes: ['id', 'quantity', 'fixed_price', 'isRate'],
                        as: 'order_item_infor',
                    },
                    as: 'Order_items',
                    attributes: ['id', 'size', 'amount'],
                    include: [
                        {
                            model: db.Shoes,
                            as: 'Shoes',
                            attributes: ['id', 'name', 'price'],
                        },
                    ],
                },
                { model: db.Status, as: 'Status', attributes: ['status'] },
                {
                    model: db.Account,
                    attributes: {
                        exclude: ['password', 'forgot_password_token', 'id_role'],
                    },
                    include: [
                        {
                            model: db.inforUser,
                            as: 'inforUser',
                            attributes: ['firstname', 'lastname', 'phoneNumber', 'avatar'],
                        },
                    ],
                },
            ],
        });
        const order = JSON.parse(JSON.stringify(Order));
        for (let i = 0; i < order.Order_items.length; i++) {
            const Image = await db.Image.findOne({
                where: { id_shoes: order.Order_items[i].Shoes.id },
                attributes: ['image'],
            });
            const image = JSON.parse(JSON.stringify(Image));
            order.Order_items[i].Shoes.image = image.image ? image.image : '';
        }
        return {
            success: true,
            result: order,
        };
    }
    async HistoryOrder(userID) {
        const order = await db.Order.findAll({
            where: { id_account: userID },
            order: [['createdAt', 'DESC']],
            include: [{ model: db.Status, as: 'Status', attributes: ['status'] }],
        });
        return {
            success: true,
            result: order,
        };
    }
    async CancelOrder(id_order) {
        const order = await db.Order.findOne({
            where: { id: id_order },
            include: [
                {
                    model: db.Size_Item,
                    through: {
                        attributes: ['quantity', 'fixed_price'],
                        as: 'order_item_infor',
                    },
                    as: 'Order_items',
                    attributes: ['id', 'amount', 'size'],
                },
                { model: db.Status, as: 'Status', attributes: ['status'] },
            ],
        });
        if (order.id_status > 1)
            throw new ErrorsWithStatus({
                status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
                message: 'can not cancel order anymore',
            });

        for (let i = 0; i < order.Order_items.length; i++) {
            // khôi phục amount của shoes ở đây
            const size_item = await db.Size_Item.findOne({ where: { id: order.Order_items[i].id } });
            await db.Size_Item.update(
                {
                    amount: size_item.amount + order.Order_items[i].order_item_infor.quantity,
                },
                {
                    where: { id: order.Order_items[i].id },
                },
            );
        }
        await db.Order.update(
            { id_status: 5 },
            {
                where: { id: id_order },
            },
        );
        return {
            success: true,
            message: 'cancel order successfully',
        };
    }
    async StatusOrder(userID, id_status) {
        const order = await db.Order.findAll({
            where: { id_account: userID, id_status: id_status },
            order: [['createdAt', 'DESC']],
            include: [{ model: db.Status, as: 'Status', attributes: ['status'] }],
        });
        return {
            success: true,
            result: order,
        };
    }
    async UpdateStatusOrder(id_order) {
        const order = await db.Order.findOne({
            where: { id: id_order },
        });
        if (order.id_status >= 4) {
            throw new ErrorsWithStatus({
                status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
                message: `can't change order's status anymore`,
            });
        }
        await db.Order.update(
            {
                id_status: order.id_status + 1,
            },
            {
                where: { id: id_order },
            },
        );
        return {
            success: true,
            message: "Updated order's status successfully",
        };
    }
    async getAllStatusOrderList(id_status) {
        const orders = await db.Order.findAll({
            where: { id_status: id_status },
            order: [['createdAt', 'DESC']],
            include: [
                { model: db.Status, as: 'Status', attributes: ['status'] },
                {
                    model: db.Account,
                    attributes: {
                        exclude: ['password', 'forgot_password_token', 'id_role'],
                    },
                    include: [
                        {
                            model: db.inforUser,
                            as: 'inforUser',
                            attributes: ['firstname', 'lastname', 'phoneNumber', 'avatar'],
                        },
                    ],
                },
            ],
        });
        return {
            success: true,
            result: orders,
        };
    }
    // ONLINE PAYMENT
    async deleteOrder(id_order) {
        await db.Order.destroy({
            where: { id: id_order },
        });
    }
}
module.exports = new OrderServices();
