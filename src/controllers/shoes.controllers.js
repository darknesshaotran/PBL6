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
    async addShoes(req, res, next) {
        const { urls, Fields } = req.formdata;
        const { id_category, id_brand, name, price, import_price, description, color } = Fields;
        const result = await shoesServices.addShoes(
            id_category,
            id_brand,
            name,
            price,
            import_price,
            description,
            color,
            urls,
        );
        res.json(result);
    }
    async deleteShoes(req, res, next) {
        const { id_shoes } = req.params;
        const result = await shoesServices.deleteShoes(id_shoes);
        res.json(result);
    }
    async updateShoesInfor(req, res, next) {
        const { id_shoes } = req.params;
        const result = await shoesServices.updateShoesInfor(id_shoes, req.body);
        res.json(result);
    }
    async updateShoesImage(req, res, next) {
        const { id_shoes } = req.params;
        const { urls, Fields } = req.formdata;
        const result = await shoesServices.updateShoesImages(id_shoes, urls);
        res.json(result);
    }
    async addSizeItem(req, res, next) {
        const { id_shoes } = req.params;
        const { size, amount } = req.body;
        const result = await shoesServices.addSizeItem(id_shoes, size, amount);
        res.json(result);
    }
}
module.exports = new ShoesController();
