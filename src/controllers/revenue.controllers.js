const revenueServices = require('../services/revenue.services');

class RevenueController {
    async getRevenuesByTime(req, res, next) {
        const { startDate, endDate } = req.query;

        const result = await revenueServices.getRevenuesByTime(startDate, endDate);
        res.json(result);
    }
    async getRevenueOfCustommer(req, res, next) {
        const { startDate, endDate } = req.query;

        const result = await revenueServices.getRevenueOfCustommer(startDate, endDate);
        res.json(result);
    }
    async getRevenueOfProduction(req, res, next) {
        const { startDate, endDate } = req.query;

        const result = await revenueServices.getRevenueOfProduction(startDate, endDate);
        res.json(result);
    }
}
module.exports = new RevenueController();
