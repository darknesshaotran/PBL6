const ErrorsWithStatus = require('../constants/Error');
const categoryServices = require('../services/category.services');
const { uploadImage } = require('../utils/fileHandle');
class CategoryController {
    async getCategoryList(req, res, next) {
        const result = await categoryServices.getCategoryList();
        res.json(result);
    }
    async deleteCategory(req, res, next) {
        const { id_category } = req.params;
        const result = await categoryServices.deleteCategory(id_category);
        res.json(result);
    }
    async addCategory(req, res, next) {
        const { urls, Fields } = req.formdata;
        const { name } = Fields;
        const result = await categoryServices.addCategory(urls, name);
        res.json(result);
    }
}
module.exports = new CategoryController();
