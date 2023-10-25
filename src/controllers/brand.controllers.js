const ErrorsWithStatus = require('../constants/Error');
const brandServices = require('../services/brand.services');
const { uploadImage } = require('../utils/fileHandle');
class BrandController {
    async getBrandList(req, res, next) {
        const result = await brandServices.getBrandList();
        res.json(result);
    }
    async deleteBrand(req, res, next) {
        const { id_brand } = req.params;
        const result = await brandServices.deleteBrand(id_brand);
        res.json(result);
    }
    async addBrand(req, res, next) {
        const { urls, fields } = await uploadImage(req);
        const Fields = JSON.parse(JSON.stringify(fields));
        const { name } = Fields;
        const result = await brandServices.addBrand(urls, name);
        res.json(result);
    }
}
module.exports = new BrandController();
