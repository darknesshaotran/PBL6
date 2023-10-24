const ErrorsWithStatus = require('../constants/Error');
const HTTP_STATUS = require('../constants/httpStatus');
const USERS_MESSAGES = require('../constants/messages');
const { uploadImage } = require('../utils/fileHandle');
const shoesServices = require('../services/shoes.services');

class ShoesController {
    async showAllShoes(req, res, next) {
        const { minPrice, maxPrice, limit, page, category, brand, search, isDesc } = req.query;
        const result = await shoesServices.getListShoes(
            Number(minPrice),
            Number(maxPrice),
            Number(limit),
            Number(page),
            category,
            brand,
            search,
            Number(isDesc),
        );
        res.json(result);
    }
    async shoesDetails(req, res, next) {
        const { id_shoes } = req.params;
        const result = await shoesServices.shoesDetails(id_shoes);
        res.json(result);
    }
}
module.exports = new ShoesController();
