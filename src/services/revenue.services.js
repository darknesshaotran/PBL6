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
                orders: orders,
                totalRevenue: totalRevenue,
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
        // TODO: Implement code to get revenue by id
    }

    async getRevenueOfYear(revenueData) {
        // TODO: Implement code to create a new revenue
    }
}

module.exports = new RevenueServices();
