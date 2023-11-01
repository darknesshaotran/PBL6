const db = require('../models');
const { Op } = require('sequelize');
const ErrorsWithStatus = require('../constants/Error');
const Account = require('../models/account');
const inforUser = require('../models/inforuser');
const HTTP_STATUS = require('../constants/httpStatus');

class RevenueServices {
    async getRevenuesByTime(startTime, endTime) {
        const orders = await db.Order.findAll({
            where: {
                id_status: 4,
                createdAt: {
                    [Op.between]: [startTime, endTime],
                },
            },
        });
        const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
        return {
            success: true,
            result: {
                totalRevenue: totalRevenue,
                orders: orders,
            },
        };
    }

    async getRevenueOfCustommer(startTime, endTime) {
        const orders = await db.Order.findAll({
            where: {
                id_status: 4,
                createdAt: {
                    [Op.between]: [startTime, endTime],
                },
            },
            include: [
                {
                    model: db.Account,
                    attributes: ['id', 'email'],
                    include: [
                        {
                            model: db.inforUser,
                            attributes: ['id', 'firstName', 'lastName', 'avatar'],
                        },
                    ],
                },
            ],
        });

        const customers = orders.reduce((customer, order) => {
            const Order = JSON.parse(JSON.stringify(order));
            const customerId = Order.Account.id;
            const customerEmail = Order.Account.email;
            const customerName = Order.Account.inforUser.firstName + ' ' + Order.Account.inforUser.lastName;
            const totalPrice = Order.totalPrice;

            if (customer[customerId]) {
                customer[customerId].totalPrice += totalPrice;
            } else {
                customer[customerId] = {
                    id: customerId,
                    email: customerEmail,
                    fullName: customerName,
                    totalPrice: totalPrice,
                };
            }

            return customer;
        }, {});
        const sortedCustomers = Object.values(customers) // Object.values() covert Object to Array
            .sort((a, b) => b.totalPrice - a.totalPrice)
            .slice(0, 20); // get only 20 customers

        const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

        return {
            success: true,
            result: {
                customers: sortedCustomers,
                totalRevenue: totalRevenue,
                // orders: orders,
            },
        };
    }

    async getRevenueOfProduction(startTime, endTime) {
        const orders = await db.Order.findAll({
            where: {
                id_status: 4,
                createdAt: {
                    [Op.between]: [startTime, endTime],
                },
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
            ],
        });

        const products = orders.reduce((product, order) => {
            const Order = JSON.parse(JSON.stringify(order));
            const Order_items = Order.Order_items;
            Order_items.forEach((item) => {
                const productId = item.id;
                const productName = item.name;
                const quantity = item.order_item_infor.quantity;
                const price = item.order_item_infor.fixed_price;

                if (product[productId]) {
                    product[productId].quantity += quantity;
                    product[productId].totalPrice += price;
                } else {
                    product[productId] = {
                        id: productId,
                        name: productName,
                        quantity: quantity,
                        totalPrice: price,
                    };
                }
            });

            return product;
        }, {});

        const sortedProducts = Object.values(products)
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 20);
        for (let i = 0; i < sortedProducts.length; i++) {
            const image = await db.Image.findOne({
                where: { id_shoes: sortedProducts[i].id },
            });
            const Image = JSON.parse(JSON.stringify(image));
            sortedProducts[i].Image = Image ? Image.image : '';
        }
        const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

        return {
            success: true,
            result: {
                products: sortedProducts,
                totalRevenue: totalRevenue,
            },
        };
    }

    async getRevenueOfYear(revenueData) {
        // TODO: Implement code to create a new revenue
    }
}

module.exports = new RevenueServices();
