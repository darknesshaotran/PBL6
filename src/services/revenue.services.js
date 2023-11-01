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
        // trả về
    }

    async getRevenueOfProduction(startTime, endTime) {
        // TODO: Implement code to get revenue by id
    }

    async getRevenueOfYear(revenueData) {
        // TODO: Implement code to create a new revenue
    }
}

module.exports = new RevenueServices();
