const db = require('../models');
const { Op } = require('sequelize');
const ErrorsWithStatus = require('../constants/Error');
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

        /////////////////////////////////////////MIDDLEWARE
        if (!order) throw new ErrorsWithStatus({ status: HTTP_STATUS.NOT_FOUND, message: 'Order not found' });

        return {
            success: true,
            result: order,
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
    async CancelOrder(id_order) {
        const order = await db.Order.findOne({
            where: { id: id_order },
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
        //////////////////////////////// MIDDLEWARE
        if (!order) throw new ErrorsWithStatus({ status: HTTP_STATUS.NOT_FOUND, message: 'Order not found' });
        if (order.id_status > 1)
            throw new ErrorsWithStatus({
                status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
                message: 'can not cancel order anymore',
            });
        //////////////////////////////
        for (let i = 0; i < order.Order_items.length; i++) {
            // khôi phục amount của shoes ở đây
            const shoes = await db.Shoes.findOne({ where: { id: order.Order_items[i].id } });
            await db.Shoes.update(
                {
                    amount: shoes.amount + order.Order_items[i].order_item_infor.quantity,
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
    async UpdateStatusOrder(id_order) {
        const order = await db.Order.findOne({
            where: { id: id_order },
        });
        if (order.id_status >= 5) {
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
            result: orders,
        };
    }
}
module.exports = new OrderServices();
