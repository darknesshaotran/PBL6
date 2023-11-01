const ErrorsWithStatus = require('../constants/Error');
const HTTP_STATUS = require('../constants/httpStatus');
const USERS_MESSAGES = require('../constants/messages');
const { uploadImage, handleFormData } = require('../utils/fileHandle');
const shoesServices = require('../services/shoes.services');
const cartServices = require('../services/cart.services');
const orderServices = require('../services/order.services');
const revenueServices = require('../services/revenue.services');
const { Result } = require('express-validator');

class RevenueController {
    async getRevenuesByTime(req, res, next) {
        const { startDate, endDate } = req.query;

        const result = await revenueServices.getRevenuesByTime(startDate, endDate);
        res.json(result);
    }
}
module.exports = new RevenueController();
