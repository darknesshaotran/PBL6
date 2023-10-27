const db = require('../models');
const { Op } = require('sequelize');
const ErrorsWithStatus = require('../constants/Error');
const Account = require('../models/account');
const inforUser = require('../models/inforuser');
const HTTP_STATUS = require('../constants/httpStatus');

class RevenueServices {
    async getRevenuesByTime(startTime, endTime) {
        // trả về tổng doanh thu, tổng lợi nhuận, danh sách các đơn hàng (success)
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
